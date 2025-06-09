import ContactHero from "./_components/ContactHero";
import ContactForm from "./_components/ContactForm";
import ContactInfo from "./_components/ContactInfo";
import ContactQuickHelp from "./_components/ContactQuickHelp";
import ContactFAQ from "./_components/ContactFAQ";
import SectionWrapper from "@/components/SectionWrapper";

export interface ContactData {
  address: {
    street: string;
    city: string;
    country: string;
  };
  phone: {
    primary: string;
    secondary: string;
  };
  email: {
    general: string;
    support: string;
    sales: string;
  };
  businessHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
}

export default function ContactPage() {
  // Contact information data
  const contactData: ContactData = {
    address: {
      street: "123 Education Street",
      city: "Learning District, CA 90210",
      country: "United States",
    },
    phone: {
      primary: "+1 (800) TEACH-EASY",
      secondary: "+1 (800) 832-2432",
    },
    email: {
      general: "hello@teacheasy.com",
      support: "support@teacheasy.com",
      sales: "sales@teacheasy.com",
    },
    businessHours: {
      weekdays: "Monday - Friday: 8:00 AM - 6:00 PM PST",
      saturday: "Saturday: 9:00 AM - 4:00 PM PST",
      sunday: "Sunday: Closed",
    },
  };

  return (
    <>
      <ContactHero />
      <SectionWrapper variant="gray">
        <div className="grid lg:grid-cols-2 gap-12">
          <ContactForm />
          <div className="space-y-8">
            <ContactInfo contactData={contactData} />
            <ContactQuickHelp />
          </div>
        </div>
      </SectionWrapper>
      <ContactFAQ />
    </>
  );
}
