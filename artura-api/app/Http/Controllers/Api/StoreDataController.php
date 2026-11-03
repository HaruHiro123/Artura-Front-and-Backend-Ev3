<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StoreDataController extends Controller
{
    // Mengambil seluruh data Orders, Commissions, Reviews, dan Settings (termasuk Pricing) dari MySQL
    public function getStoreData()
    {
        $orders = DB::table('orders')
            ->orderByDesc('id')
            ->get()
            ->map(fn($row) => json_decode($row->payload, true))
            ->filter()
            ->values();

        $commissions = DB::table('commissions')
            ->orderByDesc('id')
            ->get()
            ->map(function ($row) {
                $data = json_decode($row->payload, true);
                if (!is_array($data)) {
                    return null;
                }
                // Pastikan harga final dari database selalu sinkron ke semua field harga yang dibaca halaman User
                $resolvedPrice = isset($data['finalPrice']) && (float) $data['finalPrice'] > 0
                    ? (int) round((float) $data['finalPrice'])
                    : (int) round((float) $row->final_price);

                if ($resolvedPrice > 0) {
                    $data['finalPrice'] = $resolvedPrice;
                    $data['estimatedPrice'] = $resolvedPrice;
                    $data['price'] = $resolvedPrice;
                    $data['totalPrice'] = $resolvedPrice;
                }
                return $data;
            })
            ->filter()
            ->values();

        $reviews = DB::table('reviews')
            ->orderByDesc('id')
            ->get()
            ->map(fn($row) => json_decode($row->payload, true))
            ->filter()
            ->values();

        $settingsRows = DB::table('site_settings')->get();
        $settings = [];
        foreach ($settingsRows as $row) {
            $settings[$row->setting_key] = json_decode($row->setting_value, true);
        }

        return response()->json([
            'orders' => $orders,
            'commissions' => $commissions,
            'reviews' => $reviews,
            'pricing' => $settings['pricing'] ?? null,
            'artist' => $settings['artist'] ?? null,
            'paymentSettings' => $settings['paymentSettings'] ?? null,
            'siteSettings' => $settings['siteSettings'] ?? null,
        ]);
    }

    // Menyimpan perubahan Orders, Commissions, Reviews, dan Settings (termasuk Pricing) ke MySQL
    public function syncStoreData(Request $request)
    {
        if ($request->has('orders') && is_array($request->orders)) {
            $incomingCodes = [];
            foreach ($request->orders as $order) {
                $code = $order['id'] ?? uniqid('ART-');
                $incomingCodes[] = $code;
                DB::table('orders')->updateOrInsert(
                    ['order_code' => $code],
                    [
                        'customer_name' => $order['customerName'] ?? $order['buyerName'] ?? $order['name'] ?? 'Guest',
                        'customer_email' => $order['customerEmail'] ?? $order['email'] ?? '',
                        'total_amount' => (float) ($order['totalPrice'] ?? $order['total'] ?? 0),
                        'status' => $order['status'] ?? 'pending',
                        'payment_status' => $order['paymentStatus'] ?? 'unpaid',
                        'payload' => json_encode($order),
                        'updated_at' => now(),
                        'created_at' => now(),
                    ]
                );
            }
            if (count($incomingCodes) > 0) {
                DB::table('orders')->whereNotIn('order_code', $incomingCodes)->delete();
            } else {
                DB::table('orders')->delete();
            }
        }

        if ($request->has('commissions') && is_array($request->commissions)) {
            $incomingCodes = [];
            foreach ($request->commissions as $com) {
                $code = $com['id'] ?? uniqid('COM-');
                $incomingCodes[] = $code;

                // Ambil harga terbaru yang diupdate Admin (finalPrice) dan seragamkan ke semua field harga
                $latestPrice = (int) round((float) ($com['finalPrice'] ?? $com['estimatedPrice'] ?? $com['price'] ?? 0));
                $syncedCom = array_merge($com, [
                    'finalPrice' => $latestPrice,
                    'estimatedPrice' => $latestPrice,
                    'price' => $latestPrice,
                    'totalPrice' => $latestPrice,
                ]);

                DB::table('commissions')->updateOrInsert(
                    ['commission_code' => $code],
                    [
                        'client_name' => $com['clientName'] ?? $com['name'] ?? $com['customerName'] ?? 'Client',
                        'media_type' => $com['mediaType'] ?? 'digital',
                        'final_price' => $latestPrice,
                        'status' => $com['status'] ?? 'new',
                        'payment_status' => $com['paymentStatus'] ?? 'waiting-approval',
                        'payload' => json_encode($syncedCom),
                        'updated_at' => now(),
                        'created_at' => now(),
                    ]
                );
            }
            if (count($incomingCodes) > 0) {
                DB::table('commissions')->whereNotIn('commission_code', $incomingCodes)->delete();
            } else {
                DB::table('commissions')->delete();
            }
        }

        if ($request->has('reviews') && is_array($request->reviews)) {
            $incomingCodes = [];
            foreach ($request->reviews as $rev) {
                $code = $rev['id'] ?? uniqid('REV-');
                $incomingCodes[] = $code;

                $commentText = $rev['comment']
                    ?? $rev['review']
                    ?? $rev['text']
                    ?? $rev['message']
                    ?? $rev['body']
                    ?? '';

                $reviewerName = $rev['reviewerName']
                    ?? $rev['name']
                    ?? $rev['customerName']
                    ?? $rev['author']
                    ?? (!empty($rev['artworkTitle']) ? 'Reviewer (' . $rev['artworkTitle'] . ')' : 'Anonymous');

                DB::table('reviews')->updateOrInsert(
                    ['review_code' => $code],
                    [
                        'reviewer_name' => $reviewerName,
                        'rating' => (int) ($rev['rating'] ?? 5),
                        'comment' => $commentText,
                        'payload' => json_encode(array_merge($rev, ['comment' => $commentText, 'review' => $commentText])),
                        'updated_at' => now(),
                        'created_at' => now(),
                    ]
                );
            }
            if (count($incomingCodes) > 0) {
                DB::table('reviews')->whereNotIn('review_code', $incomingCodes)->delete();
            } else {
                DB::table('reviews')->delete();
            }
        }

        $settingKeys = ['pricing', 'artist', 'paymentSettings', 'siteSettings'];
        foreach ($settingKeys as $key) {
            if ($request->has($key) && $request->input($key) !== null) {
                DB::table('site_settings')->updateOrInsert(
                    ['setting_key' => $key],
                    [
                        'setting_value' => json_encode($request->input($key)),
                        'updated_at' => now(),
                        'created_at' => now(),
                    ]
                );
            }
        }

        return response()->json(['message' => 'Store data and commission pricing synced to MySQL successfully']);
    }

    public function getCart(Request $request)
    {
        $clientKey = $request->query('client_key', 'default_guest');
        $cart = DB::table('carts')->where('client_key', $clientKey)->first();

        return response()->json([
            'items' => $cart ? json_decode($cart->items, true) : [],
        ]);
    }

    public function syncCart(Request $request)
    {
        $clientKey = $request->input('client_key', 'default_guest');
        $items = $request->input('items', []);

        DB::table('carts')->updateOrInsert(
            ['client_key' => $clientKey],
            [
                'user_id' => $request->user()?->id,
                'items' => json_encode($items),
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );

        return response()->json(['message' => 'Cart synced to MySQL']);
    }
}