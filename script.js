document.addEventListener('DOMContentLoaded', () => {
  const projectsContainer = document.querySelector('.project-container');

  // Data detail untuk setiap proyek (sama seperti sebelumnya)
  const projectDetails = {
    'project-1': {
      title: 'Proyek "Benahi.ID"',
      details: [
        { heading: 'Kelebihan & Kekurangan', points: ['<strong>Kelebihan:</strong> Narasi lingkungan kuat, dampak ekonomi langsung, portofolio teknis solid.', '<strong>Kekurangan:</strong> Tantangan adopsi dua sisi, verifikasi kualitas, potensi konflik.'] },
        { heading: 'Roadmap 4 Bulan', points: ['<strong>B1:</strong> Registrasi & profil "Jagoan".', '<strong>B2:</strong> Fitur "Kasus" & direktori.', '<strong>B3:</strong> Chat, rating, onboarding.', '<strong>B4:</strong> Polishing & demo.'] },
        { heading: 'Target Output', points: ['5 Jagoan, 50 pengguna, 10 kasus selesai.'] },
      ],
    },
    'project-2': {
        title: 'Proyek "Akademi Digital Warga"',
        details: [
            { heading: 'Kelebihan & Kekurangan', points: ['<strong>Kelebihan:</strong> Risiko rendah, dampak terukur, narasi kuat.', '<strong>Kekurangan:</strong> Kurang teknis, ketergantungan relawan.'] },
            { heading: 'Roadmap 4 Bulan', points: ['<strong>B1:</strong> Rekrut Agen Digital.', '<strong>B2:</strong> Train-the-Trainer.', '<strong>B3:</strong> Pelatihan lapangan.', '<strong>B4:</strong> Evaluasi & laporan.'] },
            { heading: 'Target Output', points: ['15 Agen, 50 warga, +80% pengetahuan.'] },
        ],
    },
    'project-3': {
        title: 'Proyek "Tetangga Pintar"',
        details: [
            { heading: 'Kelebihan & Kekurangan', points: ['<strong>Kelebihan:</strong> Ide sederhana, mudah diadopsi, memperkuat komunitas.', '<strong>Kekurangan:</strong> Potensi penyalahgunaan, skalabilitas terbatas, butuh kepercayaan tinggi.'] },
            { heading: 'Roadmap 4 Bulan', points: ['<strong>B1:</strong> Desain & Fitur inti pinjam/kembali.', '<strong>B2:</strong> Registrasi & inventaris barang.', '<strong>B3:</strong> Uji coba di satu RT.', '<strong>B4:</strong> Rilis & feedback.'] },
            { heading: 'Target Output', points: ['1 RT terdaftar, 20+ barang dipinjam, tingkat kepuasan 90%.'] },
        ],
    },
  };

  // --- LOGIC VOTING ---
  const votes = JSON.parse(localStorage.getItem('projectVotes')) || {};
  document.querySelectorAll('.project').forEach(projectCard => {
    const projectId = projectCard.id;
    if (!votes[projectId]) { votes[projectId] = 0; }
    const voteContainer = document.createElement('div');
    voteContainer.className = 'vote-container';
    voteContainer.innerHTML = `<button class="vote-button">Beri Suara 👍</button><span class="vote-count">${votes[projectId]} suara</span>`;
    projectCard.appendChild(voteContainer);
    voteContainer.querySelector('.vote-button').addEventListener('click', (e) => {
      e.stopPropagation();
      votes[projectId]++;
      localStorage.setItem('projectVotes', JSON.stringify(votes));
      voteContainer.querySelector('.vote-count').textContent = `${votes[projectId]} suara`;
      e.target.disabled = true;
      e.target.textContent = 'Terima Kasih!';
    });
  });

  // --- LOGIC MODAL DENGAN ANIMASI MORPHING ---
  if (projectsContainer) {
    projectsContainer.addEventListener('click', (e) => {
      const projectCard = e.target.closest('.project');
      if (projectCard && !e.target.closest('.vote-button')) {
        const projectId = projectCard.id;
        const projectData = projectDetails[projectId];
        if (projectData) {
          createModal(projectData, projectCard);
        }
      }
    });
  }

  function createModal(data, cardElement) {
    const cardRect = cardElement.getBoundingClientRect();

    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';

    let detailsHtml = data.details.map(section =>
        `<h4>${section.heading}</h4><ul>${section.points.map(p => `<li>${p}</li>`).join('')}</ul>`
    ).join('');

    modalOverlay.innerHTML = `
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>${data.title}</h2>
        <div class="modal-details">${detailsHtml}</div>
      </div>
    `;

    const modalContent = modalOverlay.querySelector('.modal-content');

    // Set initial state based on the card
    modalContent.style.setProperty('--start-width', `${cardRect.width}px`);
    modalContent.style.setProperty('--start-height', `${cardRect.height}px`);
    modalContent.style.setProperty('--start-top', `${cardRect.top}px`);
    modalContent.style.setProperty('--start-left', `${cardRect.left}px`);

    document.body.appendChild(modalOverlay);

    // Trigger the animation
    requestAnimationFrame(() => {
      modalOverlay.classList.add('active');
    });

    const closeModal = () => {
      modalOverlay.classList.remove('active');
      modalOverlay.addEventListener('transitionend', () => {
        modalOverlay.remove();
      }, { once: true });
    };

    modalOverlay.querySelector('.modal-close').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  // --- CSS untuk Fitur Baru (Voting & Modal Animasi) ---
  const dynamicStyle = document.createElement('style');
  dynamicStyle.innerHTML = `
    .vote-container { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; }
    .vote-button { font-family: inherit; background-color: var(--primary-color); color: var(--bg-color); border: none; padding: 0.6rem 1rem; border-radius: 8px; cursor: pointer; font-weight: 600; transition: background-color 0.2s; }
    .vote-button:hover { background-color: var(--secondary-color); }
    .vote-button:disabled { background-color: var(--border-color); cursor: not-allowed; }
    .vote-count { font-size: 0.9rem; font-weight: 600; color: var(--subtle-text); }

    .modal-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background-color: rgba(0, 0, 0, 0.0);
      backdrop-filter: blur(0px);
      z-index: 1000;
      opacity: 0;
      transition: background-color 0.4s ease, backdrop-filter 0.4s ease, opacity 0.4s ease;
    }
    .modal-overlay.active {
      background-color: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(5px);
      opacity: 1;
    }
    .modal-content {
      position: fixed;
      top: var(--start-top); left: var(--start-left);
      width: var(--start-width); height: var(--start-height);
      background-color: var(--card-color);
      border-radius: 12px;
      border: 1px solid var(--border-color);
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    }
    .modal-overlay.active .modal-content {
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      max-width: 600px;
      height: auto;
      max-height: 90vh;
    }
    .modal-close {
      position: absolute; top: 1rem; right: 1rem;
      background: none; border: none; font-size: 2rem;
      color: var(--subtle-text); cursor: pointer; z-index: 10;
    }
    .modal-content h2, .modal-content .modal-details {
      padding: 0 2rem;
      opacity: 0;
      transition: opacity 0.3s ease 0.2s;
    }
    .modal-content h2 { padding-top: 2rem; }
    .modal-content .modal-details { padding-bottom: 2rem; flex-grow: 1; overflow-y: auto;}
    .modal-overlay.active .modal-content h2,
    .modal-overlay.active .modal-content .modal-details {
      opacity: 1;
    }
    .modal-details h4 { color: var(--primary-color); margin-top: 1.5rem; margin-bottom: 0.5rem; }
    .modal-details ul { list-style-position: inside; padding-left: 0.5rem; }
    .modal-details li { margin-bottom: 0.5rem; color: var(--subtle-text); }
  `;
  document.head.appendChild(dynamicStyle);
});
