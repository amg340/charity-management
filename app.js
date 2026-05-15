(function () {
  const STORAGE_KEY = 'charity-donations';

  const donationForm = document.getElementById('donation-form');
  const donationList = document.getElementById('donation-list');
  const totalCollected = document.getElementById('total-collected');
  const totalDonations = document.getElementById('total-donations');
  const formMessage = document.getElementById('form-message');

  if (!donationForm || !donationList || !totalCollected || !totalDonations || !formMessage) {
    return;
  }

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  function readDonations() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (_error) {
      return [];
    }
  }

  function saveDonations(donations) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(donations));
  }

  function renderSummary(donations) {
    const total = donations.reduce((sum, donation) => sum + donation.amount, 0);
    totalCollected.textContent = currencyFormatter.format(total);
    totalDonations.textContent = String(donations.length);
  }

  function renderDonations(donations) {
    donationList.innerHTML = '';

    donations
      .slice()
      .reverse()
      .forEach((donation) => {
        const row = document.createElement('tr');

        const donorCell = document.createElement('td');
        donorCell.textContent = donation.donorName;

        const campaignCell = document.createElement('td');
        campaignCell.textContent = donation.campaign;

        const amountCell = document.createElement('td');
        amountCell.textContent = currencyFormatter.format(donation.amount);

        const dateCell = document.createElement('td');
        dateCell.textContent = new Date(donation.createdAt).toLocaleDateString();

        row.appendChild(donorCell);
        row.appendChild(campaignCell);
        row.appendChild(amountCell);
        row.appendChild(dateCell);
        donationList.appendChild(row);
      });
  }

  function render() {
    const donations = readDonations();
    renderSummary(donations);
    renderDonations(donations);
  }

  donationForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(donationForm);
    const donorName = String(formData.get('donorName') || '').trim();
    const campaign = String(formData.get('campaign') || '').trim();
    const amount = Number(formData.get('amount'));

    if (!donorName || !campaign || Number.isNaN(amount) || amount <= 0) {
      formMessage.textContent = 'Please provide valid donation details.';
      return;
    }

    const donations = readDonations();
    donations.push({
      donorName,
      campaign,
      amount,
      createdAt: new Date().toISOString(),
    });

    saveDonations(donations);
    donationForm.reset();
    formMessage.textContent = 'Donation recorded successfully.';
    render();
  });

  render();
})();
