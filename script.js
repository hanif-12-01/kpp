document.addEventListener('DOMContentLoaded', () => {
  const projectsContainer = document.querySelector('.project-container');

  // Data detail untuk setiap proyek
  const projectDetails = {
    'project-1': {
      title: 'Proyek "Benahi.ID"',
      details: [
        {
          heading: 'Kelebihan & Kekurangan',
          points: [
            '<strong>Kelebihan:</strong> Narasi lingkungan kuat, dampak ekonomi langsung, portofolio teknis solid.',
            '<strong>Kekurangan:</strong> Tantangan adopsi dua sisi, verifikasi kualitas, potensi konflik.',
          ],
        },
        {
          heading: 'Roadmap 4 Bulan',
          points: [
            '<strong>B1:</strong> Registrasi & profil "Jagoan" (tukang servis).',
            '<strong>B2:</strong> Fitur pembuatan "Kasus" & direktori Jagoan.',
            '<strong>B3:</strong> Fitur chat, sistem rating, dan onboarding pengguna.',
            '<strong>B4:</strong> Polishing aplikasi dan persiapan demo final.',
          ],
        },
        {
          heading: 'Target Output',
          points: ['5 Jagoan terverifikasi, 50 pengguna aktif, 10 kasus perbaikan selesai.'],
        },
      ],
    },
    'project-2': {
      title: 'Proyek "Akademi Digital Warga"',
      details: [
        {
          heading: 'Kelebihan & Kekurangan',
          points: [
            '<strong>Kelebihan:</strong> Risiko teknis rendah, dampak sosial terukur, narasi pemberdayaan kuat.',
            '<strong>Kekurangan:</strong> Kurang menonjolkan sisi teknis, ketergantungan pada relawan.',
          ],
        },
        {
          heading: 'Roadmap 4 Bulan',
          points: [
            '<strong>B1:</strong> Rekrutmen dan seleksi calon Agen Digital.',
            '<strong>B2:</strong> Sesi Train-the-Trainer untuk para Agen.',
            '<strong>B3:</strong> Pelatihan lapangan oleh Agen kepada warga.',
            '<strong>B4:</strong> Evaluasi dampak, pengumpulan testimoni, dan laporan akhir.',
          ],
        },
        {
          heading: 'Target Output',
          points: ['15 Agen terlatih, 50 warga terbantu, peningkatan pengetahuan digital >80%.'],
        },
      ],
    },
    'project-3': {
      title: 'Proyek "Tetangga Pintar"',
      details: [
        {
          heading: 'Kelebihan & Kekurangan',
          points: [
            '<strong>Kelebihan:</strong> Ide sederhana, mudah diadopsi lingkup kecil, memperkuat komunitas.',
            '<strong>Kekurangan:</strong> Potensi penyalahgunaan, skalabilitas terbatas, butuh kepercayaan tinggi.',
          ],
        },
        {
          heading: 'Roadmap 4 Bulan',
          points: [
            '<strong>B1:</strong> Desain & fitur inti pinjam/kembali barang.',
            '<strong>B2:</strong> Sistem registrasi warga & inventaris barang.',
            '<strong>B3:</strong> Uji coba aplikasi di lingkungan satu RT.',
            '<strong>B4:</strong> Rilis, pengumpulan feedback, dan iterasi fitur.',
          ],
        },
        {
          heading: 'Target Output',
          points: ['1 RT terdaftar, 20+ barang berhasil dipinjam, tingkat kepuasan warga 90%.'],
        },
      ],
    },
  };

  // --- LOGIC VOTING ---
  const votes = JSON.parse(localStorage.getItem('projectVotes')) || {};

  document.querySelectorAll('.project').forEach(projectCard => {
    const projectId = projectCard.id;
    if (!votes[projectId]) {
      votes[projectId] = 0;
    }

    const voteContainer = document.createElement('div');
    voteContainer.className = 'vote-container';
    voteContainer.innerHTML = `
      <button class="vote-button">Beri Suara 👍</button>
      <span class="vote-count">${votes[projectId]} suara</span>
    `;
    projectCard.appendChild(voteContainer);

    voteContainer.querySelector('.vote-button').addEventListener('click', (e) => {
      e.stopPropagation(); // Mencegah modal terbuka saat tombol vote di-klik
      votes[projectId]++;
      localStorage.setItem('projectVotes', JSON.stringify(votes));
      voteContainer.querySelector('.vote-count').textContent = `${votes[projectId]} suara`;

      // Memberi feedback visual bahwa vote berhasil
      e.target.disabled = true;
      e.target.textContent = 'Terima Kasih!';
    });
  });

  // --- LOGIC MODAL ---
  if (projectsContainer) {
    projectsContainer.addEventListener('click', (e) => {
      const projectCard = e.target.closest('.project');
      if (projectCard) {
        const projectId = projectCard.id;
        const projectData = projectDetails[projectId];
        if (projectData) {
          createModal(projectData);
        }
      }
    });
  }

  function createModal(data) {
    // Hapus modal yang mungkin sudah ada
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
      existingModal.remove();
    }

    // Buat elemen modal
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';

    let detailsHtml = '';
    data.details.forEach(section => {
      detailsHtml += `<h4>${section.heading}</h4><ul>`;
      section.points.forEach(point => {
        detailsHtml += `<li>${point}</li>`;
      });
      detailsHtml += `</ul>`;
    });

    modalOverlay.innerHTML = `
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>${data.title}</h2>
        <div class="modal-details">
          ${detailsHtml}
        </div>
      </div>
    `;

    document.body.appendChild(modalOverlay);

    // Tambahkan event listener untuk menutup modal
    modalOverlay.querySelector('.modal-close').addEventListener('click', () => {
      modalOverlay.remove();
    });
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.remove();
      }
    });
  }

  // --- CSS untuk Fitur Baru (Voting & Modal) ---
  const dynamicStyle = document.createElement('style');
  dynamicStyle.innerHTML = `
    .vote-container {
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .vote-button {
      font-family: inherit;
      background-color: var(--primary-color);
      color: var(--bg-color);
      border: none;
      padding: 0.6rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: background-color 0.2s;
    }
    .vote-button:hover {
      background-color: var(--secondary-color);
    }
    .vote-button:disabled {
      background-color: var(--border-color);
      cursor: not-allowed;
    }
    .vote-count {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--subtle-text);
    }
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      backdrop-filter: blur(5px);
    }
    .modal-content {
      background-color: var(--card-color);
      padding: 2rem;
      border-radius: 12px;
      width: 90%;
      max-width: 600px;
      position: relative;
      border: 1px solid var(--border-color);
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }
    .modal-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      font-size: 2rem;
      color: var(--subtle-text);
      cursor: pointer;
    }
    .modal-details h4 {
      color: var(--primary-color);
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
    }
    .modal-details ul {
      list-style-position: inside;
      padding-left: 0.5rem;
    }
    .modal-details li {
      margin-bottom: 0.5rem;
      color: var(--subtle-text);
    }
  `;
  document.head.appendChild(dynamicStyle);
});
