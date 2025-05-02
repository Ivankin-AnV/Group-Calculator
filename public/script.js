import { setupView } from '../src/views/calculatorView.js';
import { setupController } from '../src/controllers/calculatorController.js';

document.addEventListener("DOMContentLoaded", () => {
  setupView();
  setupController();
});
