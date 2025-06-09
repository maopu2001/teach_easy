import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { ContactData } from "../page";

export default function ContactInfo({
  contactData,
}: {
  contactData: ContactData;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Address</h3>
            <p className="text-muted-foreground">
              {contactData.address.street}
              <br />
              {contactData.address.city}
              <br />
              {contactData.address.country}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <Phone className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Phone</h3>
            <p className="text-muted-foreground">
              {contactData.phone.primary}
              <br />
              {contactData.phone.secondary}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Email</h3>
            <p className="text-muted-foreground">
              General: {contactData.email.general}
              <br />
              Support: {contactData.email.support}
              <br />
              Sales: {contactData.email.sales}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Business Hours</h3>
            <p className="text-muted-foreground">
              {contactData.businessHours.weekdays}
              <br />
              {contactData.businessHours.saturday}
              <br />
              {contactData.businessHours.sunday}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
