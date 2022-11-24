const { v4: uuid } = require("uuid");
const { readFile, writeFile, appendFile } = require("node:fs/promises");
const { resolve, join } = require("path");
// const contactsPath = join(__dirname, "/db/contacts.json");
const contactsPath = resolve("./db/contacts.json");

async function updateContacts(data) {
  writeFile(contactsPath, JSON.stringify(data), "utf-8");
}

async function getContacts() {
  try {
    const contactsJson = await readFile(contactsPath, "utf-8");

    return contactsJson
      ? JSON.parse(contactsJson)
      : "Oops, something went wrong!";
  } catch (error) {
    console.error(error.message);
  }
}

async function getContactById(id) {
  try {
    const contactsAll = await getContacts();

    const reqContact = contactsAll.find((contact) => contact.id === id);

    return reqContact
      ? reqContact
      : `Contact with id ${id} was not found in contact list`;
  } catch (error) {
    console.error(error.message);
  }
}

async function removeContact(id) {
  try {
    const contactsAll = await getContacts();

    const reqContactIndex = contactsAll.findIndex(
      (contact) => contact.id === id
    );

    if (reqContactIndex === -1)
      return `Contact with id ${id} was not found in contact list`;
    const [reqContact] = contactsAll.splice(reqContactIndex, 1);

    await updateContacts(contactsAll);
    return reqContact;
  } catch (error) {
    console.error(error.message);
  }
}

async function addContact(name, email, phone) {
  try {
    const contactsAll = await getContacts();
    const id = uuid();
    const newContact = { id, name, email, phone };
    const updatedArr = [...contactsAll, newContact];
    await updateContacts(updatedArr);
    return newContact;
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = {
  getContacts,
  getContactById,
  removeContact,
  addContact,
};
