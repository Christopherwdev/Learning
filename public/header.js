const firebaseConfig = {
  apiKey: "AIzaSyCFzFZvPAVLCQxTxxIRMQ8q53_HgecJEgc",
  authDomain: "aiblock-79802.firebaseapp.com",
  projectId: "aiblock-79802",
  storageBucket: "aiblock-79802.firebasestorage.app",
  messagingSenderId: "280595651762",
  appId: "1:280595651762:web:73f85e199e3950bcc9bdab",
  measurementId: "G-4GWE11HN9T"
};

firebase.initializeApp(firebaseConfig);


function createHeader() {
  // Create header element
  const header = document.createElement('header');
  header.style.cssText = `
      width: 100%;
      box-sizing: border-box;
      cursor: pointer;
      padding: 0px 20px;
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 1000;
      background-color: #ffffffd5;
      backdrop-filter: blur(20px);
      background-blend-mode: overlay;
      border-bottom: 1px solid #e2e2e2;
      margin: 0px;
    `;

  // Create logo element
  const logo = document.createElement('div');
  logo.classList.add('logo');
  logo.textContent = 'AIToLearn.xyz';
  logo.style.cssText = `
      font-size: 24px;
      font-weight: bold;
      color: #000000;
    `;
  header.appendChild(logo);


  // Create navigation element
  const nav = document.createElement('nav');
  nav.style.cssText = `
      display: flex;
      gap: 20px;
    `;

  const navLinks = [
    { href: 'index.html', text: 'Learning' },
    { href: 'past-papers.html', text: 'Past Papers', active: false },
    //   { href: 'battlemode.html', text: 'Battle Mode' },
    { href: 'exam.html', text: 'Exam Tool' },
    { href: 'ai-teach.html', text: 'AI Teacher' },
  ];

  navLinks.forEach(link => {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.text;
    a.style.cssText = `
        text-decoration: none;
        color: rgba(0, 0, 0, 0.397);
        font-size: 16px;
        padding: 0px 8px;
        border-radius: 6px;
        transition: all 0.3s ease;
        font-weight: bold;
      `;
    if (link.active) a.classList.add('active');
    a.addEventListener('mouseover', () => a.style.color = 'black');
    a.addEventListener('mouseout', () => a.style.color = link.active ? 'black' : 'rgba(0, 0, 0, 0.397)');
    nav.appendChild(a);
  });
  header.appendChild(nav);


  // Create account element
  const account = document.createElement('div');
  account.classList.add('account');
  account.style.cssText = `
      margin-left: 80px;
      display: flex;
      align-items: center;
      gap: 10px;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 50px;
      padding: 5px;
      padding-right: 15px;
    `;

  account.addEventListener('click', function () {
    window.location.href = 'login.html';
  });

  const circle = document.createElement('div');
  circle.classList.add('circle');
  circle.style.cssText = `
      width: 25px;
      height: 25px;
      background: #004cde;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 14px;
    `;
  circle.textContent = 'S';
  account.appendChild(circle);

  const accountSpan = document.createElement('span');
  accountSpan.id = 'account-span';
  accountSpan.textContent = '';
  account.appendChild(accountSpan);
  header.appendChild(account);


  //Append header to body
  document.body.insertBefore(header, document.body.firstChild);
}


createHeader();



// Initialize Firebase

const db = firebase.firestore();
const auth = firebase.auth();

// Function to get user data from Firestore
async function getUserData(userId) {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists) {
      return userDoc.data();
    } else {
      console.error("No such user document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
}

// Function to handle user authentication state changes
function handleAuthStateChanged() {
  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in
      const userId = user.uid;
      const userEmail = user.email;

      // Get user data from Firestore
      getUserData(userId)
        .then((userData) => {
          if (userData) {
            const username = userData.username;
            // Update UI with user info
            updateUserInfo(userEmail, username);
          } else {
            // Handle case where user data is not found
            console.error("User data not found in Firestore");
          }
        })
        .catch((error) => {
          console.error("Error getting user data:", error);
        });
    } else {
      // User is signed out
      updateUserInfo(null, null);
    }
  });
}

// Function to update the UI with user information
function updateUserInfo(email, username) {
  const userInfoElement = document.getElementById('account-span');
  // if (email && username) {
  //   userInfoElement.innerHTML = `
  //       <p>Welcome, ${email}!</p>
  //       <p>Username: ${username}</p>
  //     `;
  // } else {
  //   userInfoElement.innerHTML = '<p>Log in / Sign up</p>';
  // }
}

// Call the function to handle authentication state changes
handleAuthStateChanged();