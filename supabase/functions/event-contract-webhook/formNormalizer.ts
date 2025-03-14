
import { FieldMappings } from './types.ts';

/**
 * Normalize field names from different form sources
 */
export const normalizeFormData = (formData: any) => {
  const normalized: any = {};
  
  // Copy all fields to normalized first
  for (const key in formData) {
    // Clean up any fluentform prefixes
    const cleanKey = key.replace(/^_fluentform_\d+_/, '');
    normalized[cleanKey] = formData[key];
  }
  
  console.log('Original form data keys:', Object.keys(formData));
  
  // Event contract form specific fields
  const hasEventContract = formData.name_company_contact || 
                         formData.event_type || 
                         formData.confirmed_event_date || 
                         formData.corporate_venues;
                         
  console.log('Is Event Contract form:', hasEventContract);
  
  // Special handling for event name - combine company name and event type for corporate events
  if (hasEventContract) {
    if (normalized.company_name && normalized.event_type) {
      // If company name exists, use company name + event type
      normalized.name = `${normalized.company_name} ${normalized.event_type}`.trim();
    } else if (normalized.name_company_contact && normalized.event_type) {
      // If no company name, use contact person name + event type
      const fullName = normalized.surname_company_contact ? 
                      `${normalized.name_company_contact} ${normalized.surname_company_contact}` : 
                      normalized.name_company_contact;
      normalized.name = `${fullName} ${normalized.event_type}`.trim();
    }
  }
  
  // Handle corporate venues field (multiselect)
  if (normalized.corporate_venues) {
    if (typeof normalized.corporate_venues === 'string') {
      normalized.venues = [normalized.corporate_venues];
    } else if (Array.isArray(normalized.corporate_venues)) {
      normalized.venues = normalized.corporate_venues;
    }
  }
  
  // Format address
  let formattedAddress = null;
  if (normalized.address_1) {
    if (typeof normalized.address_1 === 'string') {
      formattedAddress = normalized.address_1;
    } else if (typeof normalized.address_1 === 'object') {
      const addressParts = [
        normalized.address_1.address_line_1,
        normalized.address_1.address_line_2,
        normalized.address_1.city,
        normalized.address_1.state,
        normalized.address_1.zip,
        normalized.address_1.country
      ].filter(part => part && part.trim() !== '');
      
      formattedAddress = addressParts.join(', ');
    }
    
    if (formattedAddress) {
      normalized.address = formattedAddress;
    }
  }
  
  // Generate contract signing notes
  if (normalized.contract_signee && normalized.terms_date) {
    let contractNotes = `Contract signed by ${normalized.contract_signee} on ${normalized.terms_date}`;
    
    if (normalized.city_contract) {
      contractNotes += ` in ${normalized.city_contract}`;
      
      if (normalized.city_contract_1) {
        contractNotes += `, ${normalized.city_contract_1}`;
      }
    }
    
    if (normalized.accept_terms) {
      contractNotes += `. Terms and conditions accepted.`;
    }
    
    normalized.event_notes = contractNotes;
    normalized.description = contractNotes;
  }
  
  // Map primary contact information
  if (normalized.name_company_contact) {
    // Combine first and last name if available
    if (normalized.surname_company_contact) {
      normalized.primary_name = `${normalized.name_company_contact} ${normalized.surname_company_contact}`.trim();
    } else {
      normalized.primary_name = normalized.name_company_contact;
    }
  }
  
  if (normalized.email_bride) {
    normalized.primary_email = normalized.email_bride;
  }
  
  if (normalized.contact_number_contact_person) {
    normalized.primary_phone = normalized.contact_number_contact_person;
  } else if (normalized.contact_number_company) {
    normalized.primary_phone = normalized.contact_number_company;
  }
  
  // Handle confirmed event date
  if (normalized.confirmed_event_date) {
    normalized.event_date = normalized.confirmed_event_date;
  }
  
  // Handle number of guests as pax
  if (normalized.number_of_guests) {
    const parsedPax = parseInt(normalized.number_of_guests);
    normalized.pax = isNaN(parsedPax) ? null : parsedPax;
  }
  
  // Ensure vat_number is mapped properly
  if (normalized.vat_number) {
    normalized.vat_number = normalized.vat_number;
  }
  
  // Ensure company name is mapped properly
  if (normalized.company_name) {
    normalized.company = normalized.company_name;
  }
  
  // Handle common field mapping patterns
  const fieldMappings: FieldMappings = {
    'name': ['event_name', 'event-name', 'eventName', 'title'],
    'event_type': ['event-type', 'eventType', 'type', 'event_category', 'category'],
    'event_date': ['event-date', 'eventDate', 'date', 'confirmed_wedding_date'],
    'start_time': ['start-time', 'startTime'],
    'end_time': ['end-time', 'endTime'],
    'pax': ['guests', 'guest_count', 'guest-count', 'attendees', 'people'],
    'description': ['event_description', 'event-description', 'notes', 'details'],
    'primary_name': ['primary-name', 'primaryName', 'contact_person', 'contact-person', 'contactPerson', 'bride_name', 'bride-name', 'brideName'],
    'primary_phone': ['primary-phone', 'primaryPhone', 'contact_mobile', 'contact-mobile', 'contactMobile', 'bride_mobile', 'bride-mobile', 'brideMobile', 'phone', 'mobile'],
    'primary_email': ['primary-email', 'primaryEmail', 'contact_email', 'contact-email', 'contactEmail', 'bride_email', 'bride-email', 'brideEmail', 'email'],
    'secondary_name': ['secondary-name', 'secondaryName', 'groom_name', 'groom-name', 'groomName', 'secondary_contact', 'secondary-contact'],
    'secondary_phone': ['secondary-phone', 'secondaryPhone', 'groom_mobile', 'groom-mobile', 'groomMobile', 'secondary_mobile', 'secondary-mobile'],
    'secondary_email': ['secondary-email', 'secondaryEmail', 'groom_email', 'groom-email', 'groomEmail', 'secondary_email', 'secondary-email'],
    'company': ['company_name', 'company-name', 'companyName', 'organization', 'client_company', 'client-company'],
    'address': ['company_address', 'company-address', 'companyAddress', 'client_address', 'client-address', 'location'],
    'vat_number': ['company_vat', 'company-vat', 'companyVat', 'tax_number', 'tax-number', 'taxNumber', 'vat', 'tax_id', 'tax-id']
  };
  
  // Apply field mappings
  for (const [standardField, alternativeNames] of Object.entries(fieldMappings)) {
    // If the standard field doesn't exist in normalized data
    if (!normalized[standardField] || normalized[standardField] === '') {
      // Try to find a value from any of the alternative names
      for (const altName of alternativeNames) {
        if (normalized[altName] && normalized[altName] !== '') {
          normalized[standardField] = normalized[altName];
          break;
        }
      }
    }
  }
  
  // Ensure venues is array
  if (typeof normalized.venues === 'string') {
    normalized.venues = [normalized.venues];
  } else if (!normalized.venues) {
    normalized.venues = [];
  }
  
  // Ensure correct types
  if (normalized.pax && typeof normalized.pax === 'string') {
    const parsedPax = parseInt(normalized.pax);
    normalized.pax = isNaN(parsedPax) ? null : parsedPax;
  }
  
  console.log('Normalized form data:', normalized);
  return normalized;
};
