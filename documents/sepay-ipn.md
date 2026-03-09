SePay IPN API Documentation
Overview

IPN (Instant Payment Notification) là cơ chế thông báo giao dịch tự động từ cổng thanh toán SePay gửi đến server của merchant khi trạng thái thanh toán thay đổi, ví dụ:

Thanh toán thành công

Thanh toán thất bại

Giao dịch bị hủy

IPN cho phép hệ thống của merchant cập nhật trạng thái đơn hàng theo thời gian thực mà không cần polling.

IPN _ SePay _ SePay Dev

1. Configure IPN Endpoint

Merchant cần cấu hình URL nhận IPN trong dashboard SePay.

Steps

Đăng nhập vào SePay Merchant Portal

Truy cập
Cổng thanh toán → Cấu hình → IPN

Nhập IPN URL của hệ thống

Lưu cấu hình

Requirements

Endpoint phải dùng HTTPS

Endpoint phải trả về HTTP Status 200 để xác nhận nhận thành công IPN

Nếu không trả về 200, SePay có thể retry gửi IPN.

IPN _ SePay _ SePay Dev

2. IPN Endpoint
   HTTP Request
   POST /payment/ipn
   Content-Type
   application/json
   Request Body

SePay gửi JSON payload chứa thông tin giao dịch.

Example:

{
"timestamp": 1759134682,
"notification_type": "ORDER_PAID",
"order": {
"id": "e2c195be-c721-47eb-b323-99ab24e52d85",
"order_id": "NQD-68DA43D73C1A5",
"order_status": "CAPTURED",
"order_currency": "VND",
"order_amount": "100000.00",
"order_invoice_number": "INV-1759134677",
"custom_data": [],
"user_agent": "Mozilla/5.0",
"ip_address": "14.186.39.212",
"order_description": "Test payment"
},
"transaction": {
"id": "384c66dd-41e6-4316-a544-b4141682595c",
"payment_method": "BANK_TRANSFER",
"transaction_id": "68da43da2d9de",
"transaction_type": "PAYMENT",
"transaction_date": "2025-09-29 15:31:22",
"transaction_status": "APPROVED",
"transaction_amount": "100000",
"transaction_currency": "VND",
"authentication_status": "AUTHENTICATION_SUCCESSFUL",
"card_number": null,
"card_holder_name": null,
"card_expiry": null,
"card_funding_method": null,
"card_brand": null
},
"customer": null,
"agreement": null
}

IPN _ SePay _ SePay Dev

3. Top Level Fields
   Field	Type	Required	Description
   timestamp	integer	yes	Unix timestamp khi IPN được gửi
   notification_type	string	yes	Loại thông báo
   order	object	yes	Thông tin đơn hàng
   transaction	object	yes	Thông tin giao dịch
   customer	object/null	no	Thông tin khách hàng
   agreement	object/null	no	Thông tin agreement
4. Notification Types
   Value	Description
   ORDER_PAID	Đơn hàng đã thanh toán thành công
5. Order Object
   Field	Type	Required	Description
   id	uuid	yes	ID nội bộ của SePay
   order_id	string	yes	ID đơn hàng của SePay
   order_status	string	yes	Trạng thái đơn hàng
   order_currency	string	yes	Loại tiền
   order_amount	string	yes	Số tiền
   order_invoice_number	string	yes	Invoice number của merchant
   custom_data	array	no	Metadata
   user_agent	string	no	User agent của client
   ip_address	string	no	IP khách hàng
   order_description	string	no	Mô tả đơn hàng
6. Transaction Object
   Field	Type	Required	Description
   id	uuid	yes	Transaction ID nội bộ SePay
   payment_method	string	yes	Phương thức thanh toán
   transaction_id	string	yes	Transaction ID
   transaction_type	string	yes	Loại giao dịch
   transaction_date	datetime	yes	Thời gian giao dịch
   transaction_status	string	yes	Trạng thái giao dịch
   transaction_amount	string	yes	Số tiền
   transaction_currency	string	yes	Loại tiền
   authentication_status	string	no	Trạng thái xác thực
   card_number	string/null	no	Số thẻ (nếu có)
   card_holder_name	string/null	no	Chủ thẻ
   card_expiry	string/null	no	Expiry
   card_funding_method	string/null	no	Funding method
   card_brand	string/null	no	Brand
7. Example IPN Handler

Example xử lý IPN (PHP):

Route::post('/payment/ipn', function(Request $request) {

    $data = $request->json()->all();

    if ($data['notification_type'] === 'ORDER_PAID') {

        $order = Order::where(
            'invoice_number',
            $data['order']['order_invoice_number']
        )->first();

        $order->status = 'paid';
        $order->save();
    }

    return response()->json([
        'success' => true
    ], 200);
});

Logic thường dùng:

1️⃣ Tìm order bằng order_invoice_number
2️⃣ Kiểm tra notification_type
3️⃣ Cập nhật trạng thái order
4️⃣ Trả về HTTP 200