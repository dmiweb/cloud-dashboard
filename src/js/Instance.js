export default class Instance {
  render(id, state) {
    return `
      <div id="${id}" class="instances__control-panel control-panel">
        <div class="control-panel__server-id">${id}</div>
        <div class="control-panel__state state">
          <div class="state__title">Status:</div>
          <div class="state__indicator"></div>
          <div class="state__status">${state}</div>
        </div>
        <div class="control-panel__actions actions">
          <div class="actions__title">Actions:</div>
          <div class="actions__start-btn"></div>
          <div class="actions__delete-btn">+</div>
        </div>
      </div>
    `;
  }

  remove(element) {
    element.remove();
  }
}
