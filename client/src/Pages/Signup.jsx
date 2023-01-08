import React from 'react';

const Signup = () => {
  return (
    <form>
      <h1>Sign Up</h1>
      <label>
        Name:
        <input type="text" />
      </label>
      <br />
      <label>
        Email:
        <input type="email" />
      </label>
      <br />
      <label>
        Password:
        <input type="password" />
      </label>
      <br />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default Signup;