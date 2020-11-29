const bcrypt = require("bcrypt");
const User = require("../models/user");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const helper = require("./test_helper");
const mongoose = require("mongoose");

describe("when there is initially one user in the db", () => {
  beforeEach(async () => {
    console.log("***BeforeEach***");
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("secret", 10);
    const user = new User({ username: "root", passwordHash });
    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();
    console.log(
      "Users in DB: ",
      usersAtStart,
      "Type: ",
      typeof usersAtStart,
      " length: ",
      usersAtStart.length
    );

    const newUser = {
      username: "shreyans",
      name: "Shreyans Pathak",
      password: "testpassword",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    console.log(
      "Users in DB: ",
      usersAtEnd,
      "Type: ",
      typeof usersAtEnd,
      " length: ",
      usersAtEnd.length
    );
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation fails with proper status code and message if username already exists", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "super",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("`username` to be unique");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
