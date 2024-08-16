import {onAuthStateChanged ,signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { auth, db, storage } from "./config.js";
import { collection, query, where, getDocs ,addDoc} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";

const nav_option_show = document.querySelector('#nav_option_show')
const productTitle = document.querySelector('#product-title')
const productDescription = document.querySelector('#product-description')
const productPrice = document.querySelector('#product-price')
const userName = document.querySelector('#user-name')
const userNumber = document.querySelector('#user-number')
const Post_Now_btn =document.querySelector('#Post_Now_btn')
const upload_photo =document.querySelector('#upload-photo')

// alert position setting 
alertify.set('notifier', 'position', 'top-center');

// register btn loader
const Post_Now_btnBtn = document.querySelector('#Post_Now_btn');
const Post_Now_text = document.querySelector('#Post_Now_text');
const loadingSpinner = document.querySelector('#loading-spinner');

const titlePattern = /^.{3,}$/; // At least 3 characters
const descriptionPattern = /^.{5,}$/; // At least 5 characters
const pricePattern = /^\d+(\.\d{1,2})?$/; // Only numbers (optionally with two decimal places)
const namePattern = /^.{4,}$/; // At least 4 characters
const numberPattern = /^\d{11}$/; // Exactly 11 digits


const uploadPhoto = document.getElementById('upload-photo');
const svgIcon = document.getElementById('svg-icon');
const uploadedImage = document.getElementById('uploaded-image');

;
let logout_btn ;
let uid ;
function check_ononAuthStateChanged(){

    onAuthStateChanged(auth,async  (user) => {
        if (user) {
        uid = user.uid;
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

Post_Now_btn.addEventListener('click', async()=> {
  productTitle.style.borderColor = '';
  productDescription.style.borderColor = '';
  productPrice.style.borderColor = '';
  userName.style.borderColor = '';
  userNumber.style.borderColor = '';

  Post_Now_text.classList.add('hidden');
  loadingSpinner.classList.remove('hidden');
  Post_Now_btnBtn.disabled = true;


  if (!titlePattern.test(productTitle.value)) {
    // alert('Product title must be at least 3 characters long.');
    alertify.error('Product title must be at least 3 characters long.');
    productTitle.style.borderColor = 'red';
    resetButton();
    return;
  }

  if (!descriptionPattern.test(productDescription.value)) {
    // alert('Product description must be at least 5 characters long.');
    alertify.error('Product description must be at least 5 characters long.');

    productDescription.style.borderColor = 'red';
    resetButton();
    return;
  }

  if (!pricePattern.test(productPrice.value)) {
    // alert('Product price must be a valid number.');
    alertify.error('Product price must be a valid number.');

    productPrice.style.borderColor = 'red';
    resetButton();
    return;
  }

  if (!namePattern.test(userName.value)) {
    alertify.error('User name must be at least 4 characters long.');
    userName.style.borderColor = 'red';
    resetButton();
    return;
  }

  if (!numberPattern.test(userNumber.value)) {
    alertify.error('User number must be exactly 11 digits.');

    userNumber.style.borderColor = 'red';
    resetButton();
    return;
  }
  let urlCreated = null;

  if (upload_photo.files.length > 0) {
    const file = upload_photo.files[0];
    try {
        urlCreated = await UploadFileLink(file);
    } catch (error) {
    alertify.error(error);

    }
} else {
    alertify.error('No file selected');

    resetButton()
    return;
}


    try {
      const docRef = await addDoc(collection(db, "addPost"), {
        productTitle: productTitle.value,
        productDescription: productDescription.value,
        productPrice: productPrice.value,
        userName: userName.value,
        userNumber: userNumber.value,
        productImgUrl: urlCreated,
        uid: uid
    });
    alertify.success('Post added successfully');

    // Clear input fields after successful submission
    productTitle.value = '';
    productDescription.value = '';
    productPrice.value = '';
    userName.value = '';
    userNumber.value = '';
    upload_photo.value = '';

    uploadedImage.classList.add('hidden');
    svgIcon.classList.remove('hidden');
    
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    resetButton()
  } finally{
  
    resetButton()

  }
 

    
});
async function UploadFileLink(files) {
  const storageRef = ref(storage, `${uid}_${productTitle.value}`)
  try {
      const uploadImg = await uploadBytes(storageRef, files)
      const url = await getDownloadURL(storageRef)
      return url
  } catch (error) {
      return error
  }
}
function resetButton() {
  Post_Now_text.classList.remove('hidden');
  loadingSpinner.classList.add('hidden');
  Post_Now_btnBtn.disabled = false;
}


uploadPhoto.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      svgIcon.classList.add('hidden');
      uploadedImage.src = e.target.result;
      uploadedImage.classList.remove('hidden');
    };

    reader.readAsDataURL(file);
  }
})