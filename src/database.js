import fs from 'node:fs/promises';

const dataBasePath = new URL('../db.json', import.meta.url);
export class DataBase {
  #database = {}

  constructor() {
    fs.readFile(dataBasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      }).catch(() => {
        this.#persist()
      })
  }
  #persist() {
    fs.writeFile(dataBasePath, JSON.stringify(this.#database));
  }

  select(table, search) {
    let data = this.#database[table] ?? [];
    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          if (!value) return true
          return row[key].includes(value)
        })
      })
    }
    return data
  }

  insert(table, data) {
    console.log(data)
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }
    this.#persist()
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)
    if (rowIndex > -1) {
      const row = this.#database[table][rowIndex]
      this.#database[table][rowIndex] = {
        id, ...row, ...data

      }
      this.#persist()
    }

  }
  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)
    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist()
    }

  }
}
