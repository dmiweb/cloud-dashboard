export default class Entity {
  constructor() {
    this.url = 'https://cloud-dashboard-backend-hnq4.onrender.com/'
  }

  eventSource() {
    new EventSource(this.url + "sse");
  }

  websocket() {
    new WebSocket(this.url)
  }

  async list(callback) {
    const response = await callback(this.url);

    return await this.handlerResponse(response);
  }

  async create(callback) {
    const response = await callback(
      this.url,
      {
        method: "POST",
      }
    );

    return await this.handlerResponse(response);
  }

  async delete(id, callback) {
    const response = await callback(
      this.url + "?id=" + id,
      {
        method: "DELETE",
      }
    );

    return await this.handlerResponse(response);
  }

  async handlerResponse(response) {
    if (response.status >= 200 && response.status < 300) {
      try {
        return await response.json();
      } catch (e) {
        console.error(e);
      }
    }
  }
}
