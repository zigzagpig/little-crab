// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

// Site title and description
export const SITE_TAB = "小螃蟹";
export const SITE_TITLE = "小螃蟹 🦀";
export const SITE_DESCRIPTION = "小螃蟹的博客~ 🦀";
export const DATE_FORMAT = "ddd MMM DD YYYY";

// User profile information
export const USER_NAME = "LittleCrab";
export const USER_AVATAR = "/avatar.jpg";

// Server and transition settings
export const SERVER_URL = "https://blog-git-main-zigzagpigs-projects.vercel.app";
export const TRANSITION_API = true;

// Some informative text on the site
export const infoTest = {
  tag: "Tag: ",
  noTag: "Uncategorized",
  tagPage: "Blog - ",
  link: "Link: ",
  prevPage: "Recent posts",
  nextPage: "Older posts",
};

// Menu items for navigation
export const menuItems = [
  { id: "home", text: "Home", href: "/", svg: "home" }, // Home page
  { id: "about", text: "About", href: "/about", svg: "about" }, // About page
  { id: "blog", text: "Blogs", href: "/blog", svg: "blog" }, // Blog page
  { id: "project", text: "Projects", href: "/project", svg: "project" }, // Projects page
  { id: "friend", text: "Friends", href: "/friend", svg: "friend" }, // Friends page
  {
    id: "contact",
    text: "Contact",
    href: "mailto:contact.evesunmaple@outlook.com", // Contact email
    target: "_blank", // Open in a new tab
    svg: "contact",
  },
];

// Social media and contact icons
export const socialIcons = [
  // {
  //   href: "https://afdian.net/a/saroprock",
  //   ariaLabel: "Support my work",
  //   title: "Support my work",
  //   svg: "support",
  // },
  {
    href: "https://github.com/zigzagpig",
    ariaLabel: "Github",
    title: "Github",
    svg: "github",
  },
  {
    href: "https://space.bilibili.com/277847126",
    ariaLabel: "BiliBili",
    title: "BiliBili",
    svg: "bilibili",
  },
  {
    href: "/rss.xml",
    ariaLabel: "RSS Feed",
    title: "RSS Feed",
    svg: "rss",
  },
];
