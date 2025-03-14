
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
  
  // Extract venues (specifically for corporate events)
  // Handle different possible formats for venues data
  if (formData.corporate_venues) {
    // Handle array format with indices like corporate_venues[0], corporate_venues[1]
    const venueKeys = Object.keys(formData).filter(key => key.startsWith('corporate_venues['));
    if (venueKeys.length > 0) {
      normalized.venues = venueKeys.map(key => formData[key]);
      console.log('Extracted venues from indexed corporate_venues:', normalized.venues);
    } else if (Array.isArray(formData.corporate_venues)) {
      // If venues is already an array, use it directly
      normalized.venues = formData.corporate_venues;
      console.log('Extracted venues from corporate_venues array:', normalized.venues);
    } else {
      // If it's a single value, make it an array
      normalized.venues = [formData.corporate_venues];
      console.log('Extracted venues from corporate_venues single value:', normalized.venues);
    }
  } else if (formData.__submission && formData.__submission.user_inputs && formData.__submission.user_inputs.corporate_venues) {
    // Handle the 'user_inputs' format with comma-separated values
    normalized.venues = formData.__submission.user_inputs.corporate_venues.split(', ');
    console.log('Extracted venues from __submission.user_inputs.corporate_venues:', normalized.venues);
  } else if (formData.user_inputs && formData.user_inputs.corporate_venues) {
    // Direct user_inputs object
    normalized.venues = formData.user_inputs.corporate_venues.split(', ');
    console.log('Extracted venues from user_inputs.corporate_venues:', normalized.venues);
  } else if (normalized.corporate_venues) {
    if (typeof normalized.corporate_venues === 'string') {
      normalized.venues = [normalized.corporate_venues];
    } else if (Array.isArray(normalized.corporate_venues)) {
      normalized.venues = normalized.corporate_venues;
    }
    console.log('Extracted venues from normalized.corporate_venues:', normalized.venues);
  }
  
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
  
  // Extract and format address (handle both object and string formats)
  let formattedAddress = null;
  
  // Check for address_1 as an object structure with nested fields
  const hasNestedAddress = formData['address_1[address_line_1]'] || 
                           (formData.address_1 && typeof formData.address_1 === 'object');
  
  if (hasNestedAddress) {
    // First try to get values from flat structure like 'address_1[address_line_1]'
    const addressLine = formData['address_1[address_line_1]'] || '';
    const city = formData['address_1[city]'] || '';
    const zip = formData['address_1[zip]'] || '';
    const country = formData['address_1[country]'] || '';
    
    // Build formatted address from components
    const addressParts = [
      addressLine,
      city,
      zip,
      country === 'ZA' ? 'South Africa' : country
    ].filter(part => part && part.trim() !== '');
    
    formattedAddress = addressParts.join(', ');
    console.log('Extracted address from flat address fields:', formattedAddress);
  } else if (formData.address_1) {
    if (typeof formData.address_1 === 'object') {
      // Format address from object components
      const addressParts = [
        formData.address_1.address_line_1,
        formData.address_1.city,
        formData.address_1.zip,
        formData.address_1.country === 'ZA' ? 'South Africa' : formData.address_1.country
      ].filter(part => part && part.trim() !== '');
      
      formattedAddress = addressParts.join(', ');
    } else {
      // Use address as is if it's a string
      formattedAddress = formData.address_1;
    }
    console.log('Extracted address from address_1 object/string:', formattedAddress);
  } else if (formData.__submission && formData.__submission.user_inputs && formData.__submission.user_inputs.address_1) {
    // Get from user_inputs structure
    formattedAddress = formData.__submission.user_inputs.address_1;
    console.log('Extracted address from __submission.user_inputs.address_1:', formattedAddress);
  } else if (formData.user_inputs && formData.user_inputs.address_1) {
    // Direct user_inputs object
    formattedAddress = formData.user_inputs.address_1;
    console.log('Extracted address from user_inputs.address_1:', formattedAddress);
  }
  
  if (formattedAddress) {
    normalized.address = formattedAddress;
  }
  
  // For non-wedding events, make sure to set the address if it exists in any field
  if (normalized.event_type !== 'Wedding') {
    if (!normalized.address) {
      if (normalized.client_address) {
        normalized.address = normalized.client_address;
      } else if (normalized.company_address) {
        normalized.address = normalized.company_address;
      } else if (normalized.city_contract && normalized.city_contract_1) {
        // Use city_contract and city_contract_1 as fallback address components
        normalized.address = `${normalized.city_contract_1}, ${normalized.city_contract}`;
        console.log('Created fallback address from city_contract fields:', normalized.address);
      }
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
    console.log('Found confirmed event date:', normalized.event_date);
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
  
  // Handle secondary phone (company phone)
  if (normalized.contact_number_company && normalized.contact_number_company !== normalized.primary_phone) {
    normalized.secondary_phone = normalized.contact_number_company;
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
