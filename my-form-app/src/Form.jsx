import { useState } from "react";
import axios from "axios";

const Form = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/users",
        { name, email },
        {
          headers: { "Content-Type": "application/json" }, 
       
        }
      );

      setMessage(response.data.message);
      setName("");
      setEmail("");
    } catch (error) {
      setMessage("Error submitting form");
    }
  };

  return (
    <div>
      <h2>Submit Your Details</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Name" 
          required 
        />
        <input 
          type="email" 
          name="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
          required 
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Form;
