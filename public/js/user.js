const btnHamburger = document.querySelector('#btnHamburger');
const body = document.querySelector('body');
const header = document.querySelector('.header');
const overlay = document.querySelector('.overlay');
const fadeElems = document.querySelectorAll('.has-fade');

function geoFindMe() {
  const geoLocation = document.getElementById("geo-location");
  function success(position) {
    
    console.log(position.coords)
    geoLocation.textContent = "Location: " + position.coords.latitude + " " + position.coords.longitude
  }
  function error() {
    geoLocation.textContent =  "Geo location is not supported by your browser..."
  }
  navigator.geolocation.getCurrentPosition(success, error)
}

// Javascript for the Hamburger toggle menu
btnHamburger.addEventListener('click', function(){
  console.log('click hamburger');

  if(header.classList.contains('open')){ // Close Hamburger Menu
    body.classList.remove('noscroll');
    header.classList.remove('open');    
    fadeElems.forEach(function(element){
      element.classList.remove('fade-in');
      element.classList.add('fade-out');
    });
    
  }
  else { // Open Hamburger Menu
    body.classList.add('noscroll');
    header.classList.add('open');
    fadeElems.forEach(function(element){
      element.classList.remove('fade-out');
      element.classList.add('fade-in');
    });
  }   
});

$(document).ready(() => {
    // This file just does a GET request to figure out which user is logged in
    // and updates the HTML on the page
    $.get("/api/user_data").then(data => {
      $("#user-name").text(data.first_name);
      // $("#profile-name").text(data.first_name);
      // $("#main-image").attr("src",data.imageurl);
    });
    geoFindMe();

  const postButton = document.getElementById("post-button");
  const postTitle = document.getElementById("post-title")
  const postText = document.getElementById("post-body");
  postButton.addEventListener("click", (e) => {
    e.preventDefault();
    const postObj = {
      title: postTitle.value.trim(),
      body: postText.value.trim(),
    }

    fetch("/posts", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postObj)
    }).then((response) => {
      console.log(response)
      location.reload();
    }).catch(err => {
      console.log(err)
    })
  })

  const deleteButtons = document.querySelectorAll(".delete-button")
  if (deleteButtons) {
    $.get("/api/user_data").then(user => {
      const userId = user.id;
      deleteButtons.forEach((button) => {
        if (button.getAttribute("data-UserId") == userId) {
          console.log(userId)
          button.classList.remove("hidden");
        }
        button.addEventListener("click", (e) => {
          console.log(e.target)
          const postId = e.target.getAttribute("data-id");
          console.log("clicked", postId)
          fetch("/delete_post/" + postId, {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }).then((res) => {
            location.reload()
          })
        })
      })
    });
  }
})

let button = document.querySelector('.btn')

 // press the button to toggle the .dark-mode class
button.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark-mode')
})
