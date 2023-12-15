let profileMenu; // 전역 변수로 선언

// 헤더와 푸터 로드 함수 (Promise를 반환하도록 수정)
function loadHTML(url, id) {
  return fetch(url)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById(id).innerHTML = data;
    })
    .catch((error) => console.error(error));
}

// 로그아웃 버튼에 대한 이벤트 리스너 추가
function addLogoutEventListener() {
  const logoutButton = document.querySelector('.logout-button');
  // console.log('로그아웃 버튼 찾기:', logoutButton); // 디버깅을 위한 콘솔 로그

  if (logoutButton) {
    logoutButton.addEventListener('click', logout);
    // console.log('로그아웃 이벤트 리스너 추가됨'); // 디버깅을 위한 콘솔 로그
  }
}

// 로그아웃 요청을 서버에 보내는 함수
function logout() {
  // console.log('로그아웃 함수 호출됨');
  fetch('/api/logout', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getCookie('Authorization')}`,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
      // 로그아웃 후 처리, 예를 들어 로그인 페이지로 리다이렉트
      window.location.href = 'user-login.html';
    })
    .catch((error) => console.error('Error:', error));
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function () {
  Promise.all([
    loadHTML('header.html', 'header'),
    loadHTML('footer.html', 'footer'),
  ]).then(() => {
    const profileImage = document.querySelector('.profile-img');
    profileMenu = document.querySelector('.profile-menu'); // 여기에서 할당
    addLogoutEventListener();
    if (profileImage) {
      profileImage.addEventListener('click', toggleMenu);
    } else {
      console.error('프로필 이미지가 페이지에 존재하지 않습니다.');
    }
  });
});

function toggleMenu() {
  const accessToken = getCookie('Authorization');

  if (accessToken) {
    fetchUserDetails(accessToken)
      .then((data) => {
        if (data.role === '사장') {
          showOwnerMenu();
        } else if (data.role === '고객') {
          showCustomerMenu();
        } else {
          showDefaultMenu();
        }
      })
      .catch(() => {
        showDefaultMenu();
      });
  } else {
    showDefaultMenu();
  }
}

function showCustomerMenu() {
  profileMenu.innerHTML = `
    <button onclick="location.href='profile-edit.html'">회원 정보 수정</button>
    <button onclick="location.href='my-page.html'">주문 목록 조회</button>
    <button onclick="location.href='my-page.html'">리뷰 조회</button>
    <button class="logout-button">로그아웃</button>
  `;
  profileMenu.classList.toggle('hidden');
  addLogoutEventListener();
}

function showOwnerMenu() {
  profileMenu.innerHTML = `
    <button onclick="location.href='store-edit.html'">가게 정보 수정</button>
    <button onclick="location.href='menu-management.html'">메뉴 관리</button>
    <button onclick="location.href='order-management.html'">주문 관리</button>
    <button onclick="location.href='review-management.html'">리뷰 관리</button>
    <button class="logout-button">로그아웃</button>
  `;
  profileMenu.classList.toggle('hidden');
  addLogoutEventListener();
}

function showDefaultMenu() {
  profileMenu.innerHTML = `
    <button onclick="location.href='user-signup.html'">회원가입</button>
    <button onclick="location.href='user-login.html'">로그인</button>
  `;
  profileMenu.classList.toggle('hidden');
}

function fetchUserDetails(accessToken) {
  return fetch('/api/user', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      return data.data;
    })
    .catch((error) => {
      console.error('Error fetching user details:', error);
    });
}

function getCookie(name) {
  let cookie = {};
  document.cookie.split(';').forEach(function (el) {
    let [k, v] = el.split('=');
    cookie[k.trim()] = v;
  });
  return cookie[name];
}
