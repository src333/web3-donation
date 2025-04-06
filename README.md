This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

///////////
// project flow:
developer logs: iteration 1

1. to get here i used the command "npm create next-app ./" to create the directory
2. then i ran "npm run dev" , to see the defual page
3. i removed contents fron global.css file as ill be making my own and deleted home.modules.css files
4. i will deleted this current read me files and copy my process in the new one hardhat will create when we download its dependies
5. i will also delete the api folder in pages , \_document.js and remove contents in index.js the start fresh
6. installed tailwind via "npm install tailwindcss @tailwindcss/postcss postcss" or " npm install -D tailwindcss postcss autoprefixer" in the terminal , the
7. follow the tailwind installation steps for a next.js project and i manually created tailwind.js and post.config.mjs as stated in their documentation
8. install hardat via npm i hardhat , change hardhat version from "^2.22.19" to ^2.13.0
9. initalise hardhat via "npx hardhat init" , configure it to use js and install recommended packages
10. in terminal run "npm i ether" and "npm i ether web3modal"
11. ive created a file called componenets to split up logic of the webpage into parts via componenets that will be called in the \_app.js file in pages folder , also created a context folder for later use
12. i have implemented the logic for the first contracts
13. i have developed the backend functionality that we will use to interact with the smart contract in the crowdfunding.js file
14. i realised i accidently installed the wrong package , i installed ether not ethers , so i had to uninstall it user the command - "npm unitall ether" and install ethers using "npm i ethers"
15. i have fully implemented to footer component with responsive design
16. i implemented the backend index thats going to be the main part of the page between the header and footer but when rendering it , there was an error because my ethers package is V6 and the commands i am using is only suitable for ethers v5 so i had to unistall ethers again using the commanf "npm uninstall ethers" and reinstall ether v5 using "npm i ethers@5.7.2"
17. i implemented the index.js file which sets up the structure and order of components to be rendered on the page
18. i reinstalled ethers to use V6 as i considered it be future proof and allow use of better feature , i update outdate code to work with ether v6
19. i impelemted the hero.jsx component in copmonents folder (where the campagin creation form will in)
20. fully implented the card.jsx component to represent camapigns
21. implemented the popup.jsx component the is responsibile for the popup that allows users to donate to campaigns when they click on their respective cards
22. created unit test in test.js in test folder to test blockchain functions also using hardhat logs and console logs.
23. sometimes transaction logs dont show up on metamask so youll have the refresh wallet in settings.
24. i have edited my navbar and hero componenet to asynchronously update the GUIs based on login permissions with wallet address , admin address has been hardcoded and will need further security , i refine crowdfunding.js and \_app.js
25. i ran "npm install @openzeppelin/contracts@latest" in the terminal to download dependacies thatll allow me to use a smart contract for secuirty purpose to maintain best practise
26. i have update crowdfunding.sol to apply security best practises using openzeppelins security contract , also i create another contract called badreciever.sol to use as part of testing against Reentrancy issues

27. updates test.js with new unit test to check the new securty changes

28. i create a new route to naviagte to the admin dashboard via dashboard.js
29. create a bunch of components need for the dashboard in the AdminDashboard folder within the componenets directory
30. i ran "npm install recharts" to use to develop my charts components
