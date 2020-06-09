// user id
let id;

// email validation logic
function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// topic validation logic
function validateTopic(topicTitle) {
  const re = /^.{1,100}$/;
  return re.test(String(topicTitle));
}

// Render Requests List To DOM
function renderRequests(datalist) {
  const requestsElement = document.getElementById('listOfRequests');
  requestsElement.innerHTML = '';
  for (let req of datalist) {
    requestsElement.appendChild(createVidReqElem(req));
    const countElm = document.getElementById(`count-${req._id}`);
    const upsElm = document.getElementById(`ups-${req._id}`);
    const DownsElm = document.getElementById(`downs-${req._id}`);
    const selectElm = document.getElementById(`admin-select-status-${req._id}`);
    const inputResVidElm = document.getElementById(`admin-resVideo-${req._id}`);
    const submitButton = document.getElementById(`admin-submit-${req._id}`);
    const deleteButton = document.getElementById(`admin-delete-${req._id}`);

    upsElm.addEventListener('click', function () {
      console.log(`clicked up on ${req._id}`);
      fetch('http://localhost:7777/video-request/vote', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
          id: req._id,
          vote_type: 'ups',
          user_id: id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          countElm.innerText = data.ups.length - data.downs.length;

          if (data.ups.includes(id)) {
            DownsElm.style.opacity = 0.5;
            upsElm.style.opacity = 1;
          } else if (data.downs.includes(id)) {
            upsElm.style.opacity = 0.5;
            DownsElm.style.opacity = 1;
          } else {
            upsElm.style.opacity = 1;
            DownsElm.style.opacity = 1;
          }
        });
    });

    DownsElm.addEventListener('click', function () {
      console.log(`clicked down on ${req._id}`);
      fetch('http://localhost:7777/video-request/vote', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
          id: req._id,
          vote_type: 'downs',
          user_id: id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          countElm.innerText = data.ups.length - data.downs.length;

          if (data.ups.includes(id)) {
            DownsElm.style.opacity = 0.5;
            upsElm.style.opacity = 1;
          } else if (data.downs.includes(id)) {
            upsElm.style.opacity = 0.5;
            DownsElm.style.opacity = 1;
          } else {
            upsElm.style.opacity = 1;
            DownsElm.style.opacity = 1;
          }
        });
    });

    if (id === '1011993') {
      selectElm.addEventListener('change', () => {
        if (selectElm.value !== 'done') {
          fetch('http://localhost:7777/video-request', {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              id: req._id,
              status: selectElm.value,
              resVideo: '',
            }),
          }).then((x) => location.reload());
        }
      });

      submitButton.addEventListener('click', () => {
        fetch('http://localhost:7777/video-request', {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            id: req._id,
            status: 'done',
            resVideo: inputResVidElm.value,
          }),
        }).then((x) => location.reload());
      });

      deleteButton.addEventListener('click', () => {
        fetch('http://localhost:7777/video-request', {
          method: 'DELETE',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            id: req._id,
          }),
        }).then((x) => location.reload());
      });
    }
  }
}

// turn one request info from OBJECT to a DOM element
function createVidReqElem(req) {
  let div = document.createElement('div');
  div.innerHTML = `
<div class="card mb-3">
   ${
     id === '1011993'
       ? `
     <div class="card-header">
       <label for="status">Status:</label>

       <select id='admin-select-status-${req._id}' name="status" id="status">
        <option value="new">new</option>
        <option value="planned">planned</option>
        <option value="done">done</option>
       </select>
       <input id='admin-resVideo-${req._id}' placeholder='resulotion video' />
       <button id='admin-submit-${req._id}'  class='btn btn-success'>Submit</button>
       <button id='admin-delete-${req._id}' class='btn btn-danger' > Delete </button>
   </div>
     `
       : ''
   }
   <div class="card-body d-flex justify-content-between flex-row">
      <div class="d-flex flex-column">
         <h3>${req.topic_title}</h3>
         <p class="text-muted mb-2">${req.topic_details}</p>
         <p class="mb-0 text-muted">
         ${
           req.expected_result &&
           `<strong>Expected results:</strong> ${req.expected_result}`
         }
            
         </p>
      </div>
      <div class="d-flex flex-column text-center">
         <a id='ups-${req._id}' class="btn btn-link">🔺</a>
         <h3 id='count-${req._id}' >${
    req.votes.ups.length - req.votes.downs.length
  }</h3>
         <a id='downs-${req._id}' class="btn btn-link">🔻</a>
      </div>
   </div>
   <div class="card-footer d-flex flex-row justify-content-between">
      <div>
         <span class="text-info">${req.status}</span>
         &bullet; added by <strong>${req.author_name}</strong> on
         <strong>${new Date(req.submit_date).toLocaleDateString()}</strong>
      </div>
      <div
         class="d-flex justify-content-center flex-column 408ml-auto mr-2"
         >
         <div class="badge badge-success">
            ${req.target_level}
         </div>
      </div>
   </div>
</div>
`;

  return div;
}

document.getElementById('showTopVotedFirst').addEventListener('click', (e) => {
  e.preventDefault();
  topVotedFirst();
});

// Show posts filtered by Votes count
async function topVotedFirst(e) {
  console.log('Top first running');
  const requestsElement = document.getElementById('listOfRequests');
  requestsElement.innerHTML = '';
  const res = await fetch('http://localhost:7777/video-request');
  const data = await res.json();
  const sortedData = data.sort(
    (a, b) =>
      b.votes.ups.length -
      b.votes.downs.length -
      (a.votes.ups.length - a.votes.downs.length)
  );
  console.log(sortedData);
  renderRequests(sortedData);
}

document.addEventListener('DOMContentLoaded', () => {
  const FormElement = document.getElementById('theForm');
  const requestsElement = document.getElementById('listOfRequests');
  const topic_title = document.getElementById('theForm')['topic_title'];
  const topic_details = document.getElementById('theForm')['topic_details'];

  // find user id
  let params = new URL(document.location).searchParams;
  id = params.get('id');
  console.log(id);

  // if there's id load the page and hide the login form
  if (id) {
    document.getElementById('everythingElse').classList.remove('d-none');
    document.getElementById('loginForm').classList.add('d-none');
  }

  // id the user is the Admin
  if (id === '1011993') {
    document.getElementById('normalUserContent').classList.add('d-none');
    const controlReqDisplay = document.getElementById('controlReqDisplay');
    const filterByStatus = document.createElement('select');
    filterByStatus.innerHTML = `
      <option value='new'> new </option>
      <option value='planned'> planned </option>
      <option value='done'> done </option>
    `;
    filterByStatus.classList.add('btn');
    filterByStatus.classList.add('btn-success');
    controlReqDisplay.prepend(filterByStatus);

    filterByStatus.addEventListener('change', () => {
      async function xxx() {
        console.log('filter by running');
        const requestsElement = document.getElementById('listOfRequests');
        requestsElement.innerHTML = '';
        const res = await fetch('http://localhost:7777/video-request');
        const data = await res.json();
        const sortedData = data.filter(
          (r) => r.status === filterByStatus.value
        );
        console.log(sortedData);
        renderRequests(sortedData);
      }
      xxx();
    });
  }

  //   submit new posts to API
  FormElement.addEventListener('submit', () => {
    event.preventDefault();

    // Validation logic
    if (topic_title.value === '' || topic_details.value === '') {
      return alert('You should fill all required info!');
    } else if (!validateTopic(topic_title.value)) {
      return alert('Topic title should be less than 100 character!');
    }

    const formDataToSend = new FormData(FormElement);

    formDataToSend.append('author_id', id);

    fetch('http://localhost:7777/video-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(formDataToSend),
    })
      .then((res) => res.json())
      .then((req) => {
        requestsElement.prepend(createVidReqElem(req));
        document
          .getElementById(`ups-${req._id}`)
          .addEventListener('click', function () {
            console.log(`clicked up on ${req._id}`);
            fetch('http://localhost:7777/video-request/vote', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: JSON.stringify({
                id: req._id,
                vote_type: 'ups',
                user_id: id,
              }),
            })
              .then((res) => res.json())
              .then(
                (data) =>
                  (document.getElementById(`count-${req._id}`).innerText =
                    data.ups.length - data.downs.length)
              );
          });
        document
          .getElementById(`downs-${req._id}`)
          .addEventListener('click', function () {
            console.log(`clicked down on ${req._id}`);
            fetch('http://localhost:7777/video-request/vote', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: JSON.stringify({
                id: req._id,
                vote_type: 'downs',
                user_id: id,
              }),
            })
              .then((res) => res.json())
              .then(
                (data) =>
                  (document.getElementById(`count-${req._id}`).innerText =
                    data.ups.length - data.downs.length)
              );
          });
      });
  });

  //  get Requests list and append it to DOM
  async function getRequestList() {
    const res = await fetch('http://localhost:7777/video-request');
    const data = await res.json();
    renderRequests(data);
  }
  getRequestList();

  // Enable Searching
  const searchText = document.getElementById('searchText');
  searchText.addEventListener('keyup', function () {
    fetch('http://localhost:7777/video-request')
      .then((res) => res.json())
      .then((data) => {
        return data.filter((req) => {
          return req.topic_title.includes(searchText.value);
        });
      })
      .then((data) => renderRequests(data));
  });
});
