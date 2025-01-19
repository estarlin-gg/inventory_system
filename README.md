## Inventory System

This inventory system is developed using **React** with **TypeScript**, **TailwindCSS**, and **Supabase**. It is fully **responsive**, adapting to different screen sizes. The main features include:

- **Invoice Creation**: The system allows for quick and efficient invoice generation, with the ability to customize product details, quantity, price, and more.
- **Inventory Reporting**: Users can view available products, current quantities, and obtain detailed reports on the inventory status.
- **CRUD Operations**: The system supports full Create, Read, Update, and Delete operations for managing products and users.
- **User Management**: It allows for the creation of users with defined roles (admin, seller, etc.), enabling efficient and secure access control.
- **User Interface**: The interface is intuitive, modern, and easy to navigate, built with TailwindCSS for a smooth and professional user experience.
- **Installation Guide**: A detailed guide is provided for installing the system step by step, including all the necessary prerequisites and configurations.

### Installation Guide
1. **Prerequisites**: 
   - Node.js (minimum version: 14.x)
   - **Supabase** account for database and authentication.

2. **Installation**:
   1. Clone the repository:
      ```bash
      git clone <repository_url>
      ```
   2. Install dependencies:
      ```bash
      npm install
      ```
   3. Configure environment variables to connect to **Supabase**:
      ```bash
      SUPABASE_URL=your_supabase_url
      SUPABASE_KEY=your_supabase_key
      ```
   4. Start the application with **Vite**:
      ```bash
      npm run dev
      ```

3. **Additional Configuration**:
   - Ensure that the necessary tables and schemas are set up in **Supabase**.
   - Customize user roles and permissions as needed.
