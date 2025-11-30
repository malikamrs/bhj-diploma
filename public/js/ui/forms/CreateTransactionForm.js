/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const selectElement = this.element.querySelector('.accounts-select');
    if (!selectElement) {
      return;
    }

    Account.list({}, (err, response) => {
      if (response && response.data) {
        selectElement.innerHTML = '';
        response.data.forEach((account) => {
          const option = document.createElement('option');
          option.value = account.id;
          option.textContent = account.name;
          selectElement.appendChild(option);
        });
      }
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (response && response.success) {
        this.element.reset();
        const modalElement = this.element.closest('.modal');
        if (modalElement) {
          const modalId = modalElement.dataset.modalId;
          const modal = App.getModal(modalId);
          if (modal) {
            modal.close();
          }
        }
        App.update();
      }
    });
  }
}
