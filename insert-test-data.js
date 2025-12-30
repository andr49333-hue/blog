const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

// Load environment variables
dotenv.config();

// Import Models
const Admin = require("./models/Admin");
const Content = require("./models/Content");
const Page = require("./models/Page");

const insertTestData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully\n");

    // Drop collections to clear all data including indexes
    console.log("🔄 Clearing existing test data...");
    try {
      await mongoose.connection.db.collection("admins").deleteMany({});
      await mongoose.connection.db.collection("contents").deleteMany({});
      await mongoose.connection.db.collection("pages").deleteMany({});
    } catch (e) {
      // Collections might not exist yet
    }
    console.log("✅ Cleared existing data\n");

    // 1. Insert Admin Data
    console.log("📝 Inserting Admin Data...");
    const adminData = {
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: "super_admin",
      isActive: true,
    };

    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    const admin = await Admin.create({
      ...adminData,
      password: hashedPassword,
    });
    console.log("✅ Admin Created:", {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });

    // 2. Insert Content Data
    console.log("\n📝 Inserting Content Data...");
    const contentData = [
      {
        type: "blog",
        title: "Getting Started with Node.js",
        slug: "getting-started-nodejs",
        content:
          "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows developers to use JavaScript for server-side programming. This comprehensive guide will help you get started with Node.js development.",
        author: "John Doe",
        publicationDate: new Date("2025-12-25"),
        status: "published",
        metaTitle: "Node.js Guide",
        metaDescription: "Complete guide to getting started with Node.js",
        keywords: ["nodejs", "javascript", "backend"],
      },
      {
        type: "blog",
        title: "MongoDB Best Practices",
        slug: "mongodb-best-practices",
        content:
          "MongoDB is a popular NoSQL database. In this blog, we explore the best practices for using MongoDB effectively, including indexing, query optimization, and data modeling techniques.",
        author: "Jane Smith",
        publicationDate: new Date("2025-12-20"),
        status: "published",
        metaTitle: "MongoDB Best Practices",
        metaDescription:
          "Learn MongoDB best practices and optimization techniques",
        keywords: ["mongodb", "database", "nosql"],
      },
      {
        type: "story",
        title: "A Journey Through Code",
        slug: "journey-through-code",
        content:
          "Once upon a time, a developer embarked on a journey to master the art of coding. This is their story of challenges, learning, and success.",
        author: "Bob Johnson",
        publicationDate: new Date("2025-12-15"),
        status: "published",
        keywords: ["coding", "journey", "learning"],
      },
    ];

    const insertedContent = await Content.insertMany(contentData);
    console.log(`✅ Inserted ${insertedContent.length} Content items:`);
    insertedContent.forEach((item) => {
      console.log(`   - ${item.title} (${item.type})`);
    });

    // 3. Insert Page Data
    console.log("\n📝 Inserting Page Data...");
    const pageData = [
      {
        pageTitle: "About Us",
        slug: "about-us",
        metaTitle: "About Our Company",
        metaDescription: "Learn about our company, mission, and team",
        keywords: ["about", "company", "team", "mission"],
        googleAnalyticsId: "G-ABCDEF1234",
      },
      {
        pageTitle: "Contact Us",
        slug: "contact-us",
        metaTitle: "Contact Information",
        metaDescription: "Get in touch with our team",
        keywords: ["contact", "email", "support"],
        googleAnalyticsId: "G-XYZT567890",
      },
    ];

    const insertedPages = await Page.insertMany(pageData);
    console.log(`✅ Inserted ${insertedPages.length} Pages:`);
    insertedPages.forEach((item) => {
      console.log(`   - ${item.pageTitle}`);
    });

    // 4. Verify Data
    console.log("\n✅ ========== DATA VERIFICATION ==========");

    const adminCount = await Admin.countDocuments();
    console.log(`\n📊 Admins: ${adminCount} record(s)`);
    const admins = await Admin.find().select("-password");
    admins.forEach((admin) => {
      console.log(`   - ${admin.name} (${admin.email}) - Role: ${admin.role}`);
    });

    const contentCount = await Content.countDocuments();
    console.log(`\n📊 Content: ${contentCount} record(s)`);
    const contents = await Content.find();
    contents.forEach((content) => {
      console.log(
        `   - ${content.title} (${content.type}) by ${content.author}`
      );
    });

    const pageCount = await Page.countDocuments();
    console.log(`\n📊 Pages: ${pageCount} record(s)`);
    const pages = await Page.find();
    pages.forEach((page) => {
      console.log(`   - ${page.pageTitle}`);
    });

    console.log("\n✅ ========== INSERTION COMPLETE ==========");
    console.log(`\n📈 Summary:`);
    console.log(`   ✓ Admins: ${adminCount}`);
    console.log(`   ✓ Content Items: ${contentCount}`);
    console.log(`   ✓ Pages: ${pageCount}`);

    await mongoose.connection.close();
    console.log("\n✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

// Run the insertion
insertTestData();
