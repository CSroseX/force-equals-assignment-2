"use client";

import { signOut, useSession } from "next-auth/react";

export default function SellerDashboard() {
  const { data: session } = useSession();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
      color: '#111827',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '18px'
            }}>
              S
            </div>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#1f2937',
              margin: 0 
            }}>
              Seller Dashboard
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              textAlign: 'right',
              display: window.innerWidth > 640 ? 'block' : 'none' 
            }}>
              <p style={{ 
                fontSize: '14px', 
                color: '#6b7280', 
                margin: 0 
              }}>
                Welcome back,
              </p>
              <p style={{ 
                fontWeight: '500', 
                color: '#1f2937', 
                margin: 0 
              }}>
                {session?.user?.name || 'Seller'}
              </p>
            </div>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#d1d5db',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4b5563',
              fontWeight: '500',
              fontSize: '14px'
            }}>
              {session?.user?.name?.charAt(0) || 'S'}
            </div>
            <button
              onClick={() => signOut()}
              style={{
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: 'white',
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c)';
                e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        flexGrow: 1,
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '1.5rem',
        width: '100%'
      }}>
        {/* Stats Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {[
            { title: 'Total Bookings', value: '24', color: '#3b82f6', bgColor: '#dbeafe' },
            { title: 'This Month', value: '8', color: '#10b981', bgColor: '#d1fae5' },
            { title: 'Revenue', value: '$2,840', color: '#8b5cf6', bgColor: '#e9d5ff' }
          ].map((stat, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              padding: '1.5rem',
              border: '1px solid #f3f4f6'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between' 
              }}>
                <div>
                  <p style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#6b7280', 
                    margin: '0 0 4px 0' 
                  }}>
                    {stat.title}
                  </p>
                  <p style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold', 
                    color: '#1f2937', 
                    margin: 0 
                  }}>
                    {stat.value}
                  </p>
                </div>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: stat.bgColor,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    color: stat.color 
                  }}>
                    📊
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Calendar Section */}
          <section style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            padding: '2rem',
            border: '1px solid #f3f4f6'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginBottom: '1.5rem' 
            }}>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: '#1f2937', 
                margin: 0 
              }}>
                Calendar Availability
              </h2>
              <button style={{
                color: '#3b82f6',
                backgroundColor: 'transparent',
                border: 'none',
                fontWeight: '500',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                Manage Schedule
              </button>
            </div>
            
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#f3f4f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                fontSize: '32px'
              }}>
                📅
              </div>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#374151', 
                margin: '0 0 8px 0' 
              }}>
                Calendar Integration
              </h3>
              <p style={{ 
                color: '#6b7280', 
                margin: '0 0 1.5rem 0' 
              }}>
                Set up your availability to start receiving bookings
              </p>
              <button style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #2563eb, #1d4ed8)';
                e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
                e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
              >
                Connect Calendar
              </button>
            </div>
          </section>

          {/* Recent Activity */}
          <section style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            padding: '2rem',
            border: '1px solid #f3f4f6'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginBottom: '1.5rem' 
            }}>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: '#1f2937', 
                margin: 0 
              }}>
                Recent Activity
              </h2>
              <button style={{
                color: '#3b82f6',
                backgroundColor: 'transparent',
                border: 'none',
                fontWeight: '500',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                View All
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { text: 'New booking received', time: '2 hours ago', color: '#10b981' },
                { text: 'Profile updated', time: '1 day ago', color: '#3b82f6' },
                { text: 'Calendar sync completed', time: '3 days ago', color: '#f59e0b' }
              ].map((activity, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: activity.color,
                    borderRadius: '50%',
                    marginTop: '8px'
                  }}></div>
                  <div style={{ flexGrow: 1 }}>
                    <p style={{ 
                      fontWeight: '500', 
                      color: '#1f2937', 
                      margin: '0 0 4px 0' 
                    }}>
                      {activity.text}
                    </p>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#6b7280', 
                      margin: 0 
                    }}>
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Quick Actions */}
        <section style={{
          marginTop: '2rem',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          border: '1px solid #f3f4f6'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            margin: '0 0 1.5rem 0' 
          }}>
            Quick Actions
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {[
              { text: 'Add Service', emoji: '➕', color: '#3b82f6' },
              { text: 'View Reports', emoji: '📊', color: '#10b981' },
              { text: 'Settings', emoji: '⚙️', color: '#8b5cf6' },
              { text: 'Help & Support', emoji: '❓', color: '#f59e0b' }
            ].map((action, index) => (
              <button key={index} style={{
                padding: '1rem',
                border: '2px dashed #d1d5db',
                borderRadius: '8px',
                backgroundColor: 'white',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.borderColor = action.color;
                e.target.style.backgroundColor = `${action.color}10`;
              }}
              onMouseOut={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.backgroundColor = 'white';
              }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px auto',
                  fontSize: '16px'
                }}>
                  {action.emoji}
                </div>
                <p style={{ 
                  fontWeight: '500', 
                  color: '#374151', 
                  margin: 0 
                }}>
                  {action.text}
                </p>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}