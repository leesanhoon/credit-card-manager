# Ứng dụng Quản lý Thẻ Tín Dụng

Ứng dụng web giúp quản lý thẻ tín dụng, theo dõi ngày sao kê, ngày đến hạn và số dư cần thanh toán.

## Tính năng

- Quản lý nhiều thẻ tín dụng
- Theo dõi ngày sao kê và ngày đến hạn
- Tính toán số dư và số tiền tối thiểu cần thanh toán
- Hiển thị cảnh báo khi gần đến hạn thanh toán
- Giao diện thân thiện, dễ sử dụng
- Responsive design, hoạt động tốt trên mobile

## Công nghệ sử dụng

- Next.js 13+ với App Router
- TypeScript
- Tailwind CSS
- Vercel Deployment

## Cài đặt và Phát triển

1. Clone repository:

```bash
git clone <repository-url>
cd credit-card-manager
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Chạy môi trường development:

```bash
npm run dev
```

4. Truy cập http://localhost:3000

## Triển khai trên Vercel

1. Push code lên GitHub repository

2. Đăng nhập vào [Vercel](https://vercel.com)

3. Import project từ GitHub

4. Vercel sẽ tự động phát hiện cấu hình Next.js và triển khai ứng dụng

5. Sau khi triển khai, bạn có thể truy cập ứng dụng tại URL được Vercel cung cấp

## Cấu trúc dự án

```
src/
├── app/                    # App Router của Next.js
│   ├── api/               # API Routes
│   └── page.tsx           # Trang chính
├── components/            # React components
│   ├── CreditCardForm.tsx
│   ├── CreditCardItem.tsx
│   └── ...
├── config/               # Cấu hình
├── lib/                  # Thư viện và utilities
├── services/            # Business logic và API services
├── types/               # TypeScript type definitions
└── utils/               # Helper functions
```

## Lưu trữ dữ liệu

- Ứng dụng sử dụng JSONbin.io để lưu trữ dữ liệu
- Cấu hình JSONbin trong file `src/config/jsonbin.ts`
- Yêu cầu JSONBIN_SECRET_KEY trong file .env.local
- Dữ liệu được lưu trữ vĩnh viễn và có thể truy cập từ mọi nơi

## Bảo mật

- Không lưu trữ số thẻ tín dụng đầy đủ
- Sử dụng HTTPS cho mọi request
- Validate dữ liệu đầu vào
- Xử lý lỗi an toàn

## Đóng góp

Mọi đóng góp đều được chào đón. Vui lòng:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## License

MIT License - xem file [LICENSE.md](LICENSE.md) để biết thêm chi tiết
