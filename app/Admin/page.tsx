import { redirect } from 'next/navigation';

export default function AdminPage() {
  // Redirect to the dashboard by default
  redirect('/Admin/dashboard');
  
  // This return statement is a fallback and won't be reached due to the redirect
  return null;
}
