import {onAuthStateChanged ,signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { auth, db } from "./config.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const nav_option_show = document.querySelector('#nav_option_show')
const main_card_container = document.querySelector('#main_card_container')
const searchInput = document.querySelector('#searchInput')
alertify.set('notifier', 'position', 'top-center');

let logout_btn ;




let arr = []


searchInput.addEventListener('input', function(event) {
  const searchTerm = event.target.value;
  if (searchTerm == '') {
    render(arr)
  } else {
    const results = searchProducts(searchTerm);
    console.log(results);
    render(results)
    
  }
});
async function getDataFrom_db(){
  const querySnapshot = await getDocs(collection(db, "addPost"));
  querySnapshot.forEach((doc) => {
      // console.log(doc.data());
      arr.push(doc.data())
      
  });
  render(arr)
}
getDataFrom_db()

async function render(dt) {
  main_card_container.innerHTML = '';

  if (dt.length === 0) {
    main_card_container.innerHTML = `
      <div class="text-center">
        <h1>No data Found</h1>
      </div>
    `;
    return;
  }

  // First, render all the cards
  dt.forEach((item, index) => {
    main_card_container.innerHTML += `
      <div class="card bg-base-100 shadow-xl">
        <figure>
          <img
            class="object-cover w-full h-48 object-top rounded-[10px]"
            src="${item.productImgUrl}"
            alt="" />
        </figure>
        <div class="card-body h-100 flex flex-col justify-between">
          <div>
            <h2 class="card-title">${item.productTitle}</h2>
            <p class="text-sm overflow-hidden text-ellipsis">
              ${item.productDescription}
            </p>
          </div>
          <div class="card-actions flex justify-between items-center">
            <span class="text-lg font-semibold text-gray-700">RS ${item.productPrice}</span>
            <button class="btn btn-primary bg-[#F000B8]" id="buy-now-${index}">Buy Now</button>
          </div>
        </div>
      </div>
    `;
  });

  // Now, add event listeners to all "Buy Now" buttons
  dt.forEach((item, index) => {
    document.getElementById(`buy-now-${index}`).addEventListener('click', async() => {
      // Save the selected item data to localStorage
      onAuthStateChanged(auth,async  (user) => {
        if (user) {
          try {
            const q = query(collection(db, "users"), where("uid", "==", item.uid));
      
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
      
              const useritem = doc.data()
          
              localStorage.setItem('selectedProduct', JSON.stringify({
                ...item,
                ...useritem
              }));
          window.location.href = 'singlePage.html';
        
              // console.log(useritem);
              
    
            });
          
        } catch (error) {
          
        }
          
          // ...
        } else {
          // User is signed out
          // ...
          alertify.error('Login Frist');
        }
      });

    
      

      // Redirect to singlePage.html
      // window.location.href = 'singlePage.html';
    });
  });
}

function check_ononAuthStateChanged(){

    onAuthStateChanged(auth,async  (user) => {
        if (user) {
          const uid = user.uid;
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
        }
      });
}
check_ononAuthStateChanged()


// searchProducts item

function searchProducts(searchTerm) {
  

  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  return arr
    .filter(product => product.productTitle.toLowerCase().includes(lowerCaseSearchTerm))
    .map(product => {
      const title = product.productTitle;
      const highlightedTitle = title.replace(
        new RegExp(`(${searchTerm})`, 'gi'),
        '<span class="highlighted">$1</span>'
      );
      return { ...product, productTitle: highlightedTitle };
    });
}