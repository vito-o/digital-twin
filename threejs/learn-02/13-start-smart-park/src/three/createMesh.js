import City from "./mesh/City";
import Person from "./mesh/Person";
import scene from "./scene";

let city;
let person;
export default function createMesh() {
  city = new City(scene)
  person = new Person(scene)
}

export function updateMesh(time) {
    city.update(time)
    person.update(time)
}