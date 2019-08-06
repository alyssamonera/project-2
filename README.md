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

3. The signup page will automatically log you in 

4. Once you've completed your swipes, you will be taken to a results page that displays your most recent matches from the most recent round of swipes. These are also presented on a carousel, but now they come with a title, author, and cover in addition to the summary.

5. At any time after you've matched with a book, regardless of whether you've hit the results screen, you may navigate to your match history and view all the matches you've had so far. The link to this page is located up top, titled "Your Match History." <br> On this page, you may sort through your matches by date added, title, and author. You may also remove any match from your history.

### Installation

To install this app on your local computer:

1. Clone the repository.

<img src="https://i.imgur.com/zyyI0vd.png">

2. Open index.html in your browser.

<img src="https://i.imgur.com/bXqjE8p.png">

3. Enter an API key. [If you don't already have one, here's how to obtain it.](https://developers.google.com/books/docs/v1/getting_started)

4. You may also test out the app over at [the live site here](https://alyssamonera.github.io/blind_book_date).


## Known Issues

1. **This app requires a Google Books API key to run in its current state.** This app was developed for a General Assembly front-end development project and currently has no back-end to securely store an API key. This is a known issue and will be fixed in a forthcoming update. See Installation for details on obtaining a key.

2. **Data will occasionally fail to load from the API and fail to display summaries on the app page.** If this happens, an error message will usually display instructing the user to refresh the page. If the app page opens with only a read-more inside, please refresh the page and try again. If this doesn't fix the issue, please contact me.

3. **If you encounter any other issues, feel free to contact me.** I am new to the software engineering scene and always open to pointers.
