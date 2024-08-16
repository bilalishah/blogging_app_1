import {onAuthStateChanged ,signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import { auth, db, storage } from "./config.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

    const selectedProduct = JSON.parse(localStorage.getItem('selectedProduct'));
    const show_product_crd = document.querySelector('#show_product_crd')
    const nav_option_show = document.querySelector('#nav_option_show')
    let logout_btn;

    console.log(selectedProduct);


    if (selectedProduct) {
        // Display the product information on the page
        show_product_crd.innerHTML = `
      <div class="card lg:card-side w-full md:w-4/5 mx-auto border border-gray-300 shadow-xl">

          <figure class="w-full md:w-auto flex-shrink-0">
        <div class="relative w-64 h-64 md:w-80 md:h-80">
          <img
           src="${selectedProduct.productImgUrl}"
            alt="Album"
            class="absolute inset-0 w-full h-full object-contain"
          />
        </div>
      </figure>
      <div class="card-body">
        <div class="flex justify-between items-center">
          <h1 class="text-4xl font-bold">RS ${selectedProduct.productPrice}</h1>
          <button class="text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-8 h-8">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
        </div>
        <h2 class="card-title">${selectedProduct.productTitle}</h2>
        <p>${selectedProduct.productDescription}</p>
        
        <!-- Responsive Container with Profile Image, Name, Join Date, and Buttons -->
        <div class="bg-blue-500 w-full mt-4 p-3 flex flex-col md:flex-row md:items-center rounded-[10px]">
          <div class="relative flex-shrink-0">
            <img
              src="${selectedProduct.imgUrl}"
              alt="Profile Image"
              class="rounded-full w-12 h-12"
            />
            <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div class="mt-4 md:mt-0 md:ml-4 text-white">
            <p class="text-lg font-semibold">${selectedProduct.userName}</p>
            <p class="text-sm">Joined on January 1, 2022</p>
            <div class="mt-2 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
              <button class="bg-white text-blue-500 px-4 py-2 rounded flex items-center justify-center md:justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5 mr-2">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7-3m0 0l7 3m-7-3v11m7-8v8m0 0l-7 3m0-3l-7-3m7 3V5m7 3l-7 3" />
                </svg>
                Call Now
              </button>
              <button class="bg-white text-blue-500 px-4 py-2 rounded flex items-center justify-center md:justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5 mr-2">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 14h.01M16 10h.01M9 16h6M8 7h8a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2z" />
                </svg>
                Chat
              </button>
            </div>
          </div>
        </div>
  
        <div class="card-actions flex items-center justify-between w-full">
            <button class="btn btn-primary">Add to Cart</button>
            <!-- Location Text with Icon -->
            <div class="flex items-center space-x-2 text-sm text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-4 h-4">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 2.95 1.3 5.52 3.4 7.33L12 21l3.6-4.67C17.7 14.52 19 11.95 19 9c0-3.87-3.13-7-7-7zm0 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
              </svg>
              <p>Location: New York, NY</p>
            </div>
          </div>
          
      </div>
    </div>
      `
    } else {
        console.log('No product data found.');
    }
    
function check_ononAuthStateChanged(){

    onAuthStateChanged(auth,async  (user) => {
        if (user) {
        let uid = user.uid;
          console.log(uid);
          try {
              const q = query(collection(db, "users"), where("uid", "==", uid));
        
              const querySnapshot = await getDocs(q);
              querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                const item = doc.data()
                nav_option_show.innerHTML = `
                <div class="dropdown dropdown-end">
                  <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                    <div class="w-10 rounded-full">
                      <img
                        alt="Tailwind CSS Navbar component"
                        src="${item.imgUrl}" />
                    </div>
                  </div>
                  <ul
                    tabindex="0"
                    class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                    <li>
                      <a href="addPost.html" class="justify-between">
                        Add post
                      </a>
                    </li>
                    <li><a>Settings</a></li>
                    <li id="logout_btn"><a>Logout</a></li>
                  </ul>
                </div>
             `
             logout_btn = document.querySelector('#logout_btn')
             logout_btn.addEventListener('click',()=>{
                signOut(auth).then(() => {
                    // Sign-out successful.
                    check_ononAuthStateChanged()
                  }).catch((error) => {
                    // An error happened.
                  })
              })
    
              });
            
          } catch (error) {
            
          }
          
          // ...
        } else {
          // User is signed out
          // ...
          nav_option_show.innerHTML = `
             <a href="./login.html"  class="btn bg-green-500 btn-ghost rounded-btn">Login</a>
          `
          window.location = 'index.html'
        }
      });
}
check_ononAuthStateChanged()