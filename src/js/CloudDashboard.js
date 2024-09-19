import createRequest from "./api/createRequest";
import Entity from "./api/Entity";
import Instance from "./Instance";
import Logs from "./Logs";

export default class CloudDashboard {
  constructor(container) {
    this.container = container;

    this.api = new Entity();
    this.instance = new Instance();
    this.log = new Logs();
    this.websocket = this.api.websocket();

    this.bindToDOM = this.bindToDOM.bind(this);
    this.registerEvents = this.registerEvents.bind(this);
    this.requestCreateInstance = this.requestCreateInstance.bind(this);
    this.requestStateInstance = this.requestStateInstance.bind(this);
    this.requestRemoveInstance = this.requestRemoveInstance.bind(this);
  }

  static get markupDashboard() {
    return `
      <div class="dashboard">
        <div class="dashboard__instances instances">
          <div class="instances__title">Your micro instances:</div>
          <div class="instances__container"></div>
          <div class="instances__create-btn">Create new instance</div>
        </div>
        <div class="worklog">
          <div class="worklog__title">Worklog:</div>
        </div>
      </div>  
    `;
  }

  init() {
    this.bindToDOM();
  }

  async bindToDOM() {
    this.container.insertAdjacentHTML(
      "beforeEnd",
      CloudDashboard.markupDashboard
    );

    const instancesContainer = this.container.querySelector(
      ".instances__container"
    );

    const { data } = await this.api.list(createRequest);

    data.forEach((inst) => {
      instancesContainer.insertAdjacentHTML(
        "beforeEnd",
        this.instance.render(inst.id, inst.state)
      );
    });

    document.querySelectorAll(".state__status").forEach((status) => {
      if (status.textContent === "running") {
        const currentInstance = status.closest(".instances__control-panel");
        const startBtn = currentInstance.querySelector(".actions__start-btn");
        const indicator = currentInstance.querySelector(".state__indicator");
        const state = currentInstance.querySelector(".state__status");

        startBtn.classList.add("actions__start-btn_start");
        indicator.classList.add("state__indicator_running");
        state.textContent = "running";
      }
    });

    this.subscribeOnEvents();
    this.registerEvents();
  }

  requestCreateInstance() {
    this.api.create(createRequest);
  }

  requestRemoveInstance(e) {
    if (e.target.classList.contains("actions__delete-btn")) {
      const instance = e.target.closest(".instances__control-panel");

      this.api.delete(instance.id, createRequest);
    }
  }

  requestStateInstance(e) {
    if (e.target.classList.contains("actions__start-btn")) {
      const instance = e.target.closest(".instances__control-panel");

      this.websocket.send(JSON.stringify({ id: instance.id }));
    }
  }

  registerEvents() {
    const eventSource = this.api.sse();

    eventSource.addEventListener("message", (e) => {
      const data = JSON.parse(e.data);

      if (data.info === "Create command")
        this.received(data.id, data.info, data.timestamp);
      if (data.info === "Created")
        this.created(data.id, data.info, data.timeStamp);
      if (data.info === "Started")
        this.started(data.id, data.info, data.timeStamp);
      if (data.info === "Stopped")
        this.stopped(data.id, data.info, data.timeStamp);
      if (data.info === "Removed")
        this.removed(data.id, data.info, data.timeStamp);
    });
  }

  subscribeOnEvents() {
    const createButton = document.querySelector(".instances__create-btn");
    createButton.addEventListener("click", this.requestCreateInstance);
    this.container.addEventListener("click", this.requestStateInstance);
    this.container.addEventListener("click", this.requestRemoveInstance);
  }

  received(id, info, timestamp) {
    this.createLog(id, info, timestamp);
  }

  created(id, info, timestamp, state = "stopped") {
    const instancesContainer = this.container.querySelector(
      ".instances__container"
    );

    instancesContainer.insertAdjacentHTML(
      "beforeEnd",
      this.instance.render(id, state)
    );

    this.createLog(id, info, timestamp);

    const dashboardContainer = document.querySelector(".dashboard__instances");
    dashboardContainer.scrollTop = dashboardContainer.scrollHeight;
  }

  started(id, info, timestamp) {
    const instance = document.getElementById(id);
    const indicator = instance.querySelector(".state__indicator");
    const state = instance.querySelector(".state__status");
    const startBtn = instance.querySelector(".actions__start-btn");

    startBtn.classList.add("actions__start-btn_start");
    indicator.classList.add("state__indicator_running");
    state.textContent = "running";

    this.createLog(id, info, timestamp);
  }

  stopped(id, info, timestamp) {
    const instance = document.getElementById(id);
    const indicator = instance.querySelector(".state__indicator");
    const state = instance.querySelector(".state__status");
    const startBtn = instance.querySelector(".actions__start-btn");

    startBtn.classList.remove("actions__start-btn_start");
    indicator.classList.remove("state__indicator_running");
    state.textContent = info;

    this.createLog(id, info, timestamp);
  }

  removed(id, info, timestamp) {
    const instance = document.getElementById(id);

    this.instance.remove(instance);

    this.createLog(id, info, timestamp);
  }

  createLog(id, info, timestamp) {
    const worklogContainer = this.container.querySelector(".worklog");

    worklogContainer.insertAdjacentHTML(
      "beforeEnd",
      this.log.render(id, info, timestamp)
    );

    worklogContainer.scrollTop = worklogContainer.scrollHeight;
  }
}
