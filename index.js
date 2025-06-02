const firebaseConfig = {
  apiKey: 'AIzaSyDfLGsWAqWDX2BG58xmwetbshwA-ee2l_8',
  authDomain: 'idea-1a10b.firebaseapp.com',
  projectId: 'idea-1a10b',
  storageBucket: 'idea-1a10b.firebasestorage.app',
  messagingSenderId: '565263804169',
  appId: '1:565263804169:web:b8f943fe15a72da0bd55d8',
  measurementId: 'G-R6C4BN0Y01',
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const ideasRef = db.collection('ideas');

// Submit new idea
document.getElementById('ideaForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const category = document.getElementById('category').value;

  await ideasRef.add({
    title,
    description,
    category,
    likes: 0,
    comments: [],
  });

  document.getElementById('ideaForm').reset();
});

// Display ideas in real time
ideasRef.onSnapshot((snapshot) => {
  const ideasList = document.getElementById('ideasList');
  ideasList.innerHTML = '';

  snapshot.forEach((doc) => {
    const idea = doc.data();
    const ideaEl = document.createElement('div');
    ideaEl.classList.add('idea');
    ideaEl.innerHTML = `
  <h3>${idea.title}</h3>
  <p>${idea.description}</p>
  <p class="meta"><strong>Category:</strong> ${idea.category}</p>
  <div class="actions">
    <button onclick="likeIdea('${doc.id}')">👍 ${idea.likes}</button><br><br>
    <input type="text" id="comment-${doc.id}" placeholder="Add a comment..." />
    <button onclick="commentIdea('${doc.id}')">Comment</button><br><br>
    <button class="delete-btn" onclick="deleteIdea('${
      doc.id
    }')">🗑 Delete</button>
  </div>
  <ul>${idea.comments.map((c) => `<li>${c}</li>`).join('')}</ul>
`;
    ideasList.appendChild(ideaEl);
  });
});

async function likeIdea(id) {
  const docRef = ideasRef.doc(id);
  const doc = await docRef.get();
  const currentLikes = doc.data().likes || 0;
  await docRef.update({ likes: currentLikes + 1 });
}
window.likeIdea = async function (id) {
  const docRef = ideasRef.doc(id);
  const doc = await docRef.get();
  const currentLikes = doc.data().likes || 0;
  await docRef.update({ likes: currentLikes + 1 });
};

window.commentIdea = async function (id) {
  const commentInput = document.getElementById(`comment-${id}`);
  const newComment = commentInput.value.trim();
  if (!newComment) return;

  const docRef = ideasRef.doc(id);
  const doc = await docRef.get();
  const currentComments = doc.data().comments || [];
  currentComments.push(newComment);

  await docRef.update({ comments: currentComments });
  commentInput.value = '';
};

window.deleteIdea = async function (id) {
  if (confirm('Are you sure you want to delete this idea?')) {
    try {
      await ideasRef.doc(id).delete();
      console.log(`Idea with ID ${id} deleted.`);
    } catch (error) {
      console.error('Error deleting idea:', error);
    }
  }
};
async function commentIdea(id) {
  const commentInput = document.getElementById(`comment-${id}`);
  const newComment = commentInput.value.trim();
  if (!newComment) return;

  const docRef = ideasRef.doc(id);
  const doc = await docRef.get();
  const currentComments = doc.data().comments || [];
  currentComments.push(newComment);

  await docRef.update({ comments: currentComments });
  commentInput.value = '';
}
