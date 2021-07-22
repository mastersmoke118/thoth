import deepEqual from "deep-equal";
import { v4 as uuidv4 } from "uuid";
export class Inspector {
  // Stub of function.  Can be a nodes catch all onData
  onData = () => {};
  cache = {};

  constructor({ component, editor, node }) {
    this.component = component;
    this.editor = editor;
    this.dataControls = new Map();
    this.node = node;
    this.category = component.category;
  }

  _add(list, control, prop) {
    if (list.has(control.key))
      throw new Error(
        `Item with key '${control.key}' already been added to the inspector`
      );

    if (control[prop] !== null)
      throw new Error("Inspector has already been added to some control");

    // Attach the inspector to the incoming control instance
    control[prop] = this;
    control.editor = this.editor;
    control.node = this.node;
    control.component = this.component;
    control.id = uuidv4();

    list.set(control.dataKey, control);
  }

  add(dataControl) {
    this._add(this.dataControls, dataControl, "inspector");
    dataControl.onAdd();
    return this;
  }

  handleData(data) {
    this.node.data = {
      ...this.node.data,
      ...data,
    };

    // Send data to a possibel node global handler
    this.onData(data);

    // Send the right databack to each individual control callback handle
    this.dataControls.forEach((control, key) => {
      const isEqual = deepEqual(this.cache[key], data[key]);

      if (!isEqual && control?.onData) {
        control.onData(data[key]);
      }
    });

    this.cache = data;

    // update the node at the end ofthid
    this.node.update();
  }

  get(key) {}

  // returns all data prepared for the pubsub to send it.
  data() {
    const dataControls = Array.from(this.dataControls.entries()).reduce(
      (acc, [key, val]) => {
        // use the data method on controls to get data shape
        acc[key] = val.control;
        return acc;
      },
      {}
    );

    return {
      name: this.node.name,
      nodeId: this.node.id,
      dataControls,
      data: this.node.data,
      category: this.node.category
    };
  }

  remove(key) {}
}
