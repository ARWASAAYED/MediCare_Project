// Example: How to use the role field in your components

import { useSelector } from "react-redux";

const MyComponent = () => {
  const { user } = useSelector((s) => s.auth);

  // Check if user is a doctor
  if (user?.role === "doctor") {
    return <div>Doctor Dashboard</div>;
  }

  // Check if user is a patient
  if (user?.role === "patient") {
    return <div>Patient Portal</div>;
  }

  return <div>User Portal</div>;
};

// Or use it in conditional rendering
const UserWelcome = () => {
  const { user } = useSelector((s) => s.auth);

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Role: {user?.role === "doctor" ? "🩺 Doctor" : "👤 Patient"}</p>
    </div>
  );
};

// Usage in Navbar or Header
const Header = () => {
  const { user } = useSelector((s) => s.auth);

  return (
    <header className="bg-white shadow">
      <div className="flex justify-between items-center p-4">
        <h1>MediCare</h1>
        <div>
          <span>{user?.name}</span>
          <span className="ml-2 text-sm bg-brand-red text-white px-2 py-1 rounded">
            {user?.role?.toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  );
};

export { MyComponent, UserWelcome, Header };
