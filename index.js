// turn one result from API to DOM element
function createVidReqElem(req) {
  let div = document.createElement('div');
  div.innerHTML = `
<div class="card mb-3">
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
         <h3 id='count-${req._id}' >${req.votes.ups - req.votes.downs}</h3>
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

async function topVotedFirst(e) {
  console.log('Top first running');
  const requestsElement = document.getElementById('listOfRequests');
  requestsElement.innerHTML = '';
  const res = await fetch('http://localhost:7777/video-request');
  const data = await res.json();
  const sortedData = data.sort(
    (a, b) => b.votes.ups - b.votes.downs - (a.votes.ups - a.votes.downs)
  );
  console.log(sortedData);
  for (let req of sortedData) {
    requestsElement.appendChild(createVidReqElem(req));
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
          }),
        })
          .then((res) => res.json())
          .then(
            (data) =>
              (document.getElementById(`count-${req._id}`).innerText =
                data.ups - data.downs)
          );
      });
    document
      .getElementById(`downs-${req._id}`)
      .addEventListener('click', function () {
        fetch('http://localhost:7777/video-request/vote', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify({
            id: req._id,
            vote_type: 'downs',
          }),
        })
          .then((res) => res.json())
          .then(
            (data) =>
              (document.getElementById(`count-${req._id}`).innerText =
                data.ups - data.downs)
          );
      });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const FormElement = document.getElementById('theForm');
  const requestsElement = document.getElementById('listOfRequests');

  //   submit new posts to API
  FormElement.addEventListener('submit', () => {
    event.preventDefault();
    fetch('http://localhost:7777/video-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(new FormData(FormElement)),
    })
      .then((res) => res.json())
      .then((req) => requestsElement.prepend(createVidReqElem(req)));
  });

  //  get Requests list and append it to DOM
  async function getRequestList() {
    const res = await fetch('http://localhost:7777/video-request');
    const data = await res.json();

    for (let req of data) {
      requestsElement.appendChild(createVidReqElem(req));
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
            }),
          })
            .then((res) => res.json())
            .then(
              (data) =>
                (document.getElementById(`count-${req._id}`).innerText =
                  data.ups - data.downs)
            );
        });
      document
        .getElementById(`downs-${req._id}`)
        .addEventListener('click', function () {
          fetch('http://localhost:7777/video-request/vote', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
              id: req._id,
              vote_type: 'downs',
            }),
          })
            .then((res) => res.json())
            .then(
              (data) =>
                (document.getElementById(`count-${req._id}`).innerText =
                  data.ups - data.downs)
            );
        });
    }
  }

  getRequestList();
});
