import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type Event = Database['public']['Tables']['events']['Row'];
type EventInsert = Database['public']['Tables']['events']['Insert'];
type EventRegistration = Database['public']['Tables']['event_registrations']['Row'];
type EventRegistrationInsert = Database['public']['Tables']['event_registrations']['Insert'];
type EventApproval = Database['public']['Tables']['event_approvals']['Row'];
type EventApprovalInsert = Database['public']['Tables']['event_approvals']['Insert'];

// Mock data for development when Supabase is not connected
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Symposium 2025',
    description: 'Annual technology showcase featuring student projects and industry speakers',
    date: '2025-03-15',
    time: '10:00 AM',
    location: 'Main Auditorium',
    category: 'Technical',
    capacity: 200,
    price: 'Free',
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80',
    organizer_id: '1',
    organizer_name: 'Dr. Sarah Johnson',
    organizer_contact: 'sarah.johnson@vidyalankar.edu',
    status: 'approved',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Cultural Fest',
    description: 'A celebration of diversity through music, dance, and art performances',
    date: '2025-03-20',
    time: '11:30 AM',
    location: 'College Ground',
    category: 'Cultural',
    capacity: 500,
    price: '₹100',
    image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80',
    organizer_id: '2',
    organizer_name: 'Prof. Michael Chen',
    organizer_contact: 'michael.chen@vidyalankar.edu',
    status: 'approved',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Career Fair',
    description: 'Connect with top companies and explore career opportunities',
    date: '2025-03-25',
    time: '9:00 AM',
    location: 'Seminar Hall',
    category: 'Academic',
    capacity: 300,
    price: 'Free',
    image_url: 'https://images.unsplash.com/photo-1559587521-f4911e0ad803?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80',
    organizer_id: '3',
    organizer_name: 'Dr. Emily Rodriguez',
    organizer_contact: 'emily.rodriguez@vidyalankar.edu',
    status: 'approved',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const mockRegistrations: EventRegistration[] = [];
const mockFacultyEvents: Event[] = [];
const mockPendingEvents: Event[] = [];

// Check if we're using mock data
const useMockData = () => {
  return !supabase.supabaseUrl.includes('supabase.co') || 
         supabase.supabaseUrl.includes('placeholder-project');
};

// Event CRUD operations
export const eventService = {
  // Get all approved events
  getEvents: async (): Promise<Event[]> => {
    if (useMockData()) {
      return mockEvents;
    }
    
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'approved')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      return mockEvents; // Fallback to mock data on error
    }
  },

  // Get a single event by ID
  getEventById: async (id: string): Promise<Event | null> => {
    if (useMockData()) {
      return mockEvents.find(event => event.id === id) || null;
    }
    
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching event:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching event:', error);
      const mockEvent = mockEvents.find(event => event.id === id);
      return mockEvent || null;
    }
  },

  // Create a new event (for faculty)
  createEvent: async (event: Omit<EventInsert, 'id' | 'status'>): Promise<{ data: Event | null; error: any }> => {
    if (useMockData()) {
      const newEvent: Event = {
        id: uuidv4(),
        ...event,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      mockFacultyEvents.push(newEvent);
      mockPendingEvents.push(newEvent);
      return { data: newEvent, error: null };
    }
    
    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          ...event,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating event:', error);
        return { data: null, error };
      }

      // Create initial approval record
      if (data) {
        try {
          const { error: approvalError } = await supabase
            .from('event_approvals')
            .insert({
              event_id: data.id,
              status: 'pending'
            });

          if (approvalError) {
            console.error('Error creating approval record:', approvalError);
          }
        } catch (approvalError) {
          console.error('Error creating approval record:', approvalError);
        }
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error creating event:', error);
      return { data: null, error };
    }
  },

  // Update an existing event (for faculty and admin)
  updateEvent: async (
    eventId: string,
    eventData: Partial<Omit<EventInsert, 'id' | 'status' | 'organizer_id'>>
  ): Promise<{ data: Event | null; error: any }> => {
    if (useMockData()) {
      // Update in mockEvents
      const eventIndex = mockEvents.findIndex(e => e.id === eventId);
      if (eventIndex !== -1) {
        mockEvents[eventIndex] = {
          ...mockEvents[eventIndex],
          ...eventData,
          updated_at: new Date().toISOString()
        };
      }
      
      // Update in mockFacultyEvents
      const facultyEventIndex = mockFacultyEvents.findIndex(e => e.id === eventId);
      if (facultyEventIndex !== -1) {
        mockFacultyEvents[facultyEventIndex] = {
          ...mockFacultyEvents[facultyEventIndex],
          ...eventData,
          updated_at: new Date().toISOString()
        };
      }
      
      // If it's in pending events, update there too
      const pendingEventIndex = mockPendingEvents.findIndex(e => e.id === eventId);
      if (pendingEventIndex !== -1) {
        mockPendingEvents[pendingEventIndex] = {
          ...mockPendingEvents[pendingEventIndex],
          ...eventData,
          updated_at: new Date().toISOString()
        };
      }
      
      // Return the updated event
      const updatedEvent = mockEvents.find(e => e.id === eventId) || 
                          mockFacultyEvents.find(e => e.id === eventId) ||
                          mockPendingEvents.find(e => e.id === eventId);
      
      return { data: updatedEvent || null, error: null };
    }
    
    try {
      const { data, error } = await supabase
        .from('events')
        .update({
          ...eventData,
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId)
        .select()
        .single();

      if (error) {
        console.error('Error updating event:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error updating event:', error);
      return { data: null, error };
    }
  },

  // Delete an event (for faculty and admin)
  deleteEvent: async (eventId: string): Promise<{ success: boolean; error: any }> => {
    if (useMockData()) {
      // Remove from all mock arrays
      const eventIndex = mockEvents.findIndex(e => e.id === eventId);
      if (eventIndex !== -1) {
        mockEvents.splice(eventIndex, 1);
      }
      
      const facultyEventIndex = mockFacultyEvents.findIndex(e => e.id === eventId);
      if (facultyEventIndex !== -1) {
        mockFacultyEvents.splice(facultyEventIndex, 1);
      }
      
      const pendingEventIndex = mockPendingEvents.findIndex(e => e.id === eventId);
      if (pendingEventIndex !== -1) {
        mockPendingEvents.splice(pendingEventIndex, 1);
      }
      
      // Remove any registrations for this event
      const registrationIndices = mockRegistrations
        .map((reg, index) => reg.event_id === eventId ? index : -1)
        .filter(index => index !== -1)
        .sort((a, b) => b - a); // Sort in descending order to remove from end first
      
      for (const index of registrationIndices) {
        mockRegistrations.splice(index, 1);
      }
      
      return { success: true, error: null };
    }
    
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) {
        console.error('Error deleting event:', error);
        return { success: false, error };
      }

      return { success: true, error: null };
    } catch (error) {
      console.error('Error deleting event:', error);
      return { success: false, error };
    }
  },

  // Get events created by a faculty member
  getFacultyEvents: async (facultyId: string): Promise<Event[]> => {
    if (useMockData()) {
      return mockFacultyEvents.filter(event => event.organizer_id === facultyId);
    }
    
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('organizer_id', facultyId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching faculty events:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching faculty events:', error);
      return [];
    }
  },

  // Get all events (for admin)
  getAllEvents: async (): Promise<Event[]> => {
    if (useMockData()) {
      // Combine all events from different sources and remove duplicates
      const allEvents = [...mockEvents, ...mockFacultyEvents, ...mockPendingEvents];
      const uniqueEvents = allEvents.filter((event, index, self) => 
        index === self.findIndex(e => e.id === event.id)
      );
      return uniqueEvents.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all events:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching all events:', error);
      return [];
    }
  },

  // Get pending events for admin approval
  getPendingEvents: async (): Promise<Event[]> => {
    if (useMockData()) {
      return mockPendingEvents;
    }
    
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pending events:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching pending events:', error);
      return [];
    }
  },

  // Approve or reject an event (for admin)
  updateEventStatus: async (
    eventId: string, 
    status: 'approved' | 'rejected', 
    adminId: string, 
    comment?: string
  ): Promise<boolean> => {
    if (useMockData()) {
      const eventIndex = mockPendingEvents.findIndex(e => e.id === eventId);
      if (eventIndex !== -1) {
        mockPendingEvents[eventIndex].status = status;
        
        // If approved, add to mockEvents
        if (status === 'approved') {
          const existingIndex = mockEvents.findIndex(e => e.id === eventId);
          if (existingIndex === -1) {
            mockEvents.push(mockPendingEvents[eventIndex]);
          } else {
            mockEvents[existingIndex] = mockPendingEvents[eventIndex];
          }
        }
        
        // Remove from pending events
        mockPendingEvents.splice(eventIndex, 1);
      }
      return true;
    }
    
    try {
      const { error } = await supabase
        .from('event_approvals')
        .insert({
          event_id: eventId,
          admin_id: adminId,
          status,
          comment
        });

      if (error) {
        console.error('Error updating event status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating event status:', error);
      return false;
    }
  },

  // Register for an event
  registerForEvent: async (
    eventId: string,
    userId: string,
    registrationData: Omit<EventRegistrationInsert, 'id' | 'event_id' | 'user_id' | 'ticket_id'>
  ): Promise<{ data: EventRegistration | null; error: any }> => {
    // Generate a ticket ID
    const ticketId = `${eventId.substring(0, 4)}-${uuidv4().substring(0, 8)}`.toUpperCase();

    if (useMockData()) {
      const event = mockEvents.find(e => e.id === eventId);
      if (!event) {
        return { data: null, error: { message: 'Event not found' } };
      }
      
      const newRegistration: EventRegistration = {
        id: uuidv4(),
        event_id: eventId,
        user_id: userId,
        ticket_id: ticketId,
        status: 'confirmed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...registrationData
      };
      
      mockRegistrations.push(newRegistration);
      return { data: newRegistration, error: null };
    }
    
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: eventId,
          user_id: userId,
          ticket_id: ticketId,
          ...registrationData
        })
        .select()
        .single();

      if (error) {
        console.error('Error registering for event:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error registering for event:', error);
      return { data: null, error };
    }
  },

  // Get user's registered events
  getUserRegistrations: async (userId: string): Promise<{ event: Event; registration: EventRegistration }[]> => {
    if (useMockData()) {
      const userRegs = mockRegistrations.filter(reg => reg.user_id === userId);
      return userRegs.map(reg => {
        const event = mockEvents.find(e => e.id === reg.event_id);
        if (!event) {
          // This shouldn't happen in a real scenario, but we need to handle it
          const dummyEvent: Event = {
            id: reg.event_id,
            title: 'Unknown Event',
            description: 'Event details not available',
            date: new Date().toISOString().split('T')[0],
            time: '12:00 PM',
            location: 'Unknown',
            category: 'Other',
            capacity: 0,
            price: 'Free',
            image_url: null,
            organizer_id: '',
            organizer_name: 'Unknown',
            organizer_contact: null,
            status: 'approved',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          return { event: dummyEvent, registration: reg };
        }
        return { event, registration: reg };
      });
    }
    
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select(`
          *,
          event:events(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user registrations:', error);
        return [];
      }

      return (data || []).map(item => ({
        event: item.event as Event,
        registration: item as EventRegistration
      }));
    } catch (error) {
      console.error('Error fetching user registrations:', error);
      return [];
    }
  },

  // Get registrations for a specific event (for faculty)
  getEventRegistrations: async (eventId: string): Promise<EventRegistration[]> => {
    if (useMockData()) {
      return mockRegistrations.filter(reg => reg.event_id === eventId);
    }
    
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching event registrations:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching event registrations:', error);
      return [];
    }
  }
};