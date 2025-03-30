# Market C2C App - Express Node Server

This repository contains the backend code for a C2C marketplace application built using Node.js and Express. The server handles various functionalities required for the C2C marketplace app.

Check out the React Native App - [Market React Native App](https://github.com/trantuananh-17/market-app)

## Stack Used

- **Backend**: Express, Node.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT, Bcrypt
- **File Upload**: Formidable, Cloudinary
- **Utilities**: Date-fns, Yup
- **Development Tools**: TypeScript, ts-node-dev, tsc-alias
- **Email**: Nodemailer
- **Env Management**: dotenv

## Getting Started

1. Clone this repository: `git clone https://github.com/trantuananh-17/market-server`
2. Navigate to the project directory: `cd market-server`
3. Install dependencies: `npm install`
4. Create a `.env` file in the root directory and set up your environment variables.
5. Run the server: Running in Development - `npm run dev`

## API Endpoints

### Auth

- /api/auth/sign-up: Endpoint for registering a new user.
- /api/auth/verify: Endpoint for verifying the user's email.
- /api/auth/sign-in: Endpoint for user login.
- /api/auth/refresh-token: Endpoint for refreshing the user's token.
- /api/auth/sign-out: Endpoint for logging out the user.
- /api/auth/profile: Endpoint for retrieving the user's profile.
- /api/auth/profile/:id: Endpoint for get a user's profile by user ID.
- /api/auth/verify-token: Endpoint for verifying the user's authentication token.
- /api/auth/update-avatar: Endpoint for updating the user's avatar.
- /api/auth/update-profile: Endpoint for updating the user's profile information.
- /api/auth/forget-pass: Endpoint for requesting a password reset.
- /api/auth/verify-pass-reset-token: Endpoint for verifying the password reset token.
- /api/auth/reset-pass: Endpoint for resetting the user's password.

### Product

- /api/product/create: Endpoint for create new products.
- /api/product/:id: Endpoint for delete a product by its ID.
- /api/product/:id: Endpoint for updating a product by its ID.
- /api/product/image/:productId/:imageId: Endpoint for deleting a image from a product.
- /api/product/detail/:id: Endpoint for get a product detail by its ID.
- /api/product/by-category/:category: Endpoint for get products by a category.
- /api/product/latest: Endpoint for get all the latest products.
- /api/product/listings: Endpoint for get all product listings by user.

## Contributing

Contributions are welcome! If you find any bugs or want to add new features, feel free to open an issue or submit a pull request.
