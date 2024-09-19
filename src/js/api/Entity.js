export default class Entity {
  async list(callback) {
    const response = await callback(
      "https://cloud-dashboard-backend-hnq4.onrender.com"
    );

    return await this.handlerResponse(response);
  }

  async create(callback) {
    const response = await callback(
      "https://cloud-dashboard-backend-hnq4.onrender.com",
      {
        method: "POST",
      }
    );

    return await this.handlerResponse(response);
  }

  async delete(id, callback) {
    const response = await callback(
      "https://cloud-dashboard-backend-hnq4.onrender.com/?id=" + id,
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
