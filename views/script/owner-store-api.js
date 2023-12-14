
// 조회 : 매장 정보 (매장 수정일 경우)
// 브라우저가 열렸을 때 실행
document.addEventListener('DOMContentLoaded', function () {
  // 부모 url에서 id 값 추출하기(iframe를 사용할 경우)
  const url = window.parent.location.href; // 부모 페이지의 url 조회
  const urlArr = url.split("="); // =로 나눠버리기!!(param이 더 있으면 이거 못 씁니다~)
  const id = urlArr[1];
  console.log('id: ', id);

  // 쿼리 스트링 id 받아오기(iframe를 사용하지 않을 경우)
  // const urlParams = new URLSearchParams(window.location.search);
  // const id = urlParams.get('id');

  // 조회 : 매장 정보 (매장 수정일 경우)
  if (id) {
    axios
      .get(`http://localhost:4000/api/store/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        // 기존 input란에 API 반환값 참조
        document.getElementById('name').value = res.data.data.name;
        document.getElementById('description').value =
          res.data.data.description;
      })
      .catch((error) => {
        console.error('오류 발생:', error);
      });
  }

});

// 저장 : 매장 정보
function submitCreateForm() {
  // API로 전달할 값 JSON으로 설정
  const data = {
    name: document.getElementById('name').value,
    storedescription: document.getElementById('description').value,
    foodtype: document.getElementById('foodtype').value,
    storeaddresses: document.getElementById('storeaddresses').value,
    businesslicense: document.getElementById('businesslicense').value,
  };

  axios
    .post('http://localhost:4000/api/uploadstore', data, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    })
    .then((res) => {
      alert('저장이 완료되었습니다.');
      window.parent.location.href = `http://localhost:4000/owner-main.html?id=${res.data.data.id}`;
    })
    .catch((error) => {
      console.error('오류 발생:', error);
    });
}

// 수정 : 매장 정보
function submitUpdateForm() {
  // 부모 url에서 id 값 추출하기(iframe를 사용할 경우)
  const url = window.parent.location.href; // 부모 페이지의 url 조회
  const urlArr = url.split("="); // =로 나눠버리기!!(param이 더 있으면 이거 못 씁니다~)
  const id = urlArr[1];

  // 쿼리 스트링 id 받아오기(iframe를 사용하지 않을 경우)
  // const urlParams = new URLSearchParams(window.location.search);
  // const id = urlParams.get('id');

  // API로 전달할 값 JSON으로 설정
  const data = {
    name: document.getElementById('name').value,
    storedescription: document.getElementById('description').value,
    foodtype: document.getElementById('foodtype').value,
    storeaddresses: document.getElementById('storeaddresses').value,
    businesslicense: document.getElementById('businesslicense').value,
  };

  axios
    .put(`http://localhost:4000/api/updatestore/${id}`, data, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    })
    .then((res) => {
      alert('수정이 완료되었습니다.');
      location.reload(); // 페이지 새로고침
    })
    .catch((error) => {
      console.error('오류 발생:', error);
    });
}

// 삭제 : 매장 정보
// 매장가 존재할 경우에만 동작하도록 수정 필요
function submitDeleteForm() {
  // 부모 url에서 id 값 추출하기(iframe를 사용할 경우)
  const url = window.parent.location.href; // 부모 페이지의 url 조회
  const urlArr = url.split("="); // =로 나눠버리기!!(param이 더 있으면 이거 못 씁니다~)
  const id = urlArr[1];

  // 쿼리 스트링 id 받아오기(iframe를 사용하지 않을 경우)
  // const urlParams = new URLSearchParams(window.location.search);
  // const id = urlParams.get('id');
  axios
    .delete(`http://localhost:4000/api/deletestore/${id}`, {
      withCredentials: true,
    })
    .then((res) => {
      // 삭제하기 전에 정말 삭제할거에요? 알림창으로 하자!
      alert('삭제가 완료되었습니다.');
      window.parent.location.href = 'owner-store-create.html'; // 사장 가게 등록 페이지 이동
    })
    .catch((error) => {
      console.error('오류 발생:', error);
    });
}
