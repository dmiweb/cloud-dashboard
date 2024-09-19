export default class Logs {
  render(id, info, timestamp) {
    return `
      <div class="worklog__item log-item">
        <div class="log-item__date">${timestamp}</div>
        <div class="log-item__server-id log-server-id">  
          <span class="log-server-id__title">Server:</span>
          <span class="log-server-id__id">${id}</span>
        </div>
        <div class="log-item__info log-info">
          <span class="log-info__title">INFO:</span>
          <span class="log-info__text">${info}</span>
        </div>
      </div>
    `;
  }
}
