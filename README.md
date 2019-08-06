# Calliope

**NOTE: This app is currently in development.** It was started as a project for [the General Assembly Software Engineering Immersive (Remote)](https://generalassemb.ly/education/software-engineering-immersive/new-york-city) and will likely see further development upon completion of the course.

*In Greek mythology, Calliope [...] is the Muse who presides over eloquence and epic poetry; so called from the ecstatic harmony of her voice.* Source: [Wikipedia](https://en.wikipedia.org/wiki/Calliope)

Calliope is a community for writers seeking inspiration for new story ideas. Users can post and respond to text, image, and video prompts provided by others from the community.

* Users must register an account to write and respond to prompts. All passwords are hashed with a one-way encryption.
* Calliope utilizes a rich text editor provided by **[Summernote](https://summernote.org/)** for all prompts and stories.
* Users can browse by prompt, tag, and author.

## How It Works

Some of these technologies will most likely be replaced as I continue to learn more languages and databases.

### Technologies Used

This app currently utilizes basic front-end technologies (e.g. HTML5, CSS3, and JavaScript) and the non-relational database **MongoDB**, which is hosted on **Atlas**. It may switch over to a more relationship-friendly database such as SQL in the coming months.

* The app relies largely on Node.js packages such as Express, Mongoose, Express-Session, EJS, dotenv, and bcrypt.

* All prompts and replies have their own set of RESTful/CRUD routes (e.g. new, post, index, show, edit, put, and destroy).

* As mentioned above, Calliope uses the [Summernote rich text editor](https://summernote.org/) for all prompts and stories.

* It also uses [Bootstrap](https://getbootstrap.com/) as a CSS framework.

### Approaches Taken

* Calliope bars access to restricted pages such as the "new reply" and "new prompt" pages with a simple modal pop-up that forces them to either log in or register for an account.

```
<% if (!currentUser) { %>
  <div class="my-modal">
    <div class="my-modal-textbox">
      <h3>Hold up!</h3>
      <p>You need to log in to do that.</p>
      <a href="/login"><button class="btn">Log In</button></a>
      <a href="/signup"><button class="btn">Sign Up</button></a>
    </div>
  </div>
<% } %>
```

* Other errors, such as entering the wrong password or trying to take a username that is already taken, are handled similarly.

* Once the user is logged in, they can access their own posts, reply to others' posts, create their own, and edit their profile.

* All three models (User, Prompt, Reply) are related to each other. Every user can create a prompt and reply; every prompt has a user and an array of replies; every reply has a parent prompt and a user. The way this works is rather messy at the moment, since MongoDB is not relational by nature, but may see some improvements after the completion of the course.

```
Models.Prompt.findById(req.params.id, (err, prompt) => {
  prompt.replies.push(reply);
  prompt.save();
  Models.User.findById(prompt.author.id, (err, user) => {
    user.prompts.id(req.params.id).replies.push(reply);
    user.save();
    Models.User.findById(req.body.author.id, (err, author) => {
      author.replies.push(reply);
      author.save();
      reply.save();
      res.redirect(`/prompts/${req.params.id}`)
```
* Since each model has a relationship with each other, the EJS pages can easily populate the index and show pages with the relevant data.

```
<div class="prompt-show">
  <h3><%= prompt.title %></h3>
  <% if (prompt.body) { %>
    <p><%- prompt.body %></p>
  <% }%>
  <a href="/users/<%= prompt.author.id %>">
    <p class="blockquote-footer text-muted byline">
      <%= prompt.author.username %>
    </p></a>
</div>
```

### Instructions

1. To create an account, click the sign up button at the top.

2. Enter your desired username and password. You may provide an avatar URL. By default, the image will be an anonymous icon.

3. The signup page will automatically log you in and take you back to the main page.

4. From there, you can hit "browse" to look at an index of prompts, or hit "create" to write your own prompt.

5. On the prompt page, you can either reply to the prompt or edit/delete it based on whether you're the author. If you aren't logged in, you won't see any of these options.

6. All prompts are capable of embedding videos or inserting images, but replies are restricted to text only.

### Installation

To access this app, visit the site at https://calliope-app.herokuapp.com/


## Known Issues

1. **If you delete a response and try to write a new one to the same prompt, the site won't let you.** This is supposed to prevent people from spamming replies to a prompt, but if you delete your response and try to write a new one, the site will stop you from doing so. **You should be able to do it if you log out and log back in,** but I can't quite figure out why.

2. 

3. **If you encounter any other issues, feel free to contact me.** I am new to the software engineering scene and always open to pointers.
