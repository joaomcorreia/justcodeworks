import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteProject, Page, Section, Field

def create_premium_tire_sections():
    # Get Joe's Garage project
    try:
        project = SiteProject.objects.get(slug='joes-garage')
        print(f"Found project: {project.name}")
        
        # Get the homepage (first page)
        homepage = project.pages.first()
        if not homepage:
            print("No homepage found!")
            return
            
        print(f"Working with homepage: {homepage.title}")
        
        # Clear existing sections to avoid conflicts
        homepage.sections.all().delete()
        print("Cleared existing sections")
        
        # Create Premium Hero Section
        hero_section = Section.objects.create(
            page=homepage,
            identifier="jcw-tire-center-premium-01-hero-01",
            order=1
        )
        
        # Hero fields
        Field.objects.create(section=hero_section, key="title", value="Joe's Premium Tire Center")
        Field.objects.create(section=hero_section, key="subtitle", value="Experience the ultimate in tire service and quality")
        Field.objects.create(section=hero_section, key="description", value="Premium tires, professional installation, and unmatched customer service. We don't just sell tires - we deliver complete tire solutions.")
        Field.objects.create(section=hero_section, key="cta_text", value="Shop Premium Tires")
        Field.objects.create(section=hero_section, key="cta_secondary", value="Schedule Service")
        
        print("✓ Created premium hero section")
        
        # Create Premium Services Section
        services_section = Section.objects.create(
            page=homepage,
            identifier="jcw-tire-center-premium-01-services-01",
            order=2
        )
        
        # Services fields
        Field.objects.create(section=services_section, key="title", value="Premium Tire Services")
        Field.objects.create(section=services_section, key="subtitle", value="Complete tire solutions from installation to maintenance")
        
        Field.objects.create(section=services_section, key="service_1_title", value="Premium Tire Installation")
        Field.objects.create(section=services_section, key="service_1_description", value="Professional installation of high-performance tires with precision balancing and alignment checks. We work with all major premium brands including Michelin, Bridgestone, and Continental.")
        
        Field.objects.create(section=services_section, key="service_2_title", value="Advanced Wheel Alignment")
        Field.objects.create(section=services_section, key="service_2_description", value="State-of-the-art computerized alignment services to ensure optimal tire wear and vehicle handling. Our precision equipment guarantees manufacturer specifications.")
        
        Field.objects.create(section=services_section, key="service_3_title", value="Tire Repair & Maintenance")
        Field.objects.create(section=services_section, key="service_3_description", value="Expert tire repair services including patch jobs, valve stem replacement, and emergency roadside assistance. We extend tire life through proper maintenance.")
        
        Field.objects.create(section=services_section, key="service_4_title", value="Performance Tire Packages")
        Field.objects.create(section=services_section, key="service_4_description", value="Specialized high-performance and racing tire packages for enthusiasts. Complete wheel and tire combinations with professional fitment and tuning.")
        
        print("✓ Created premium services section")
        
        # Create Premium Testimonials Section
        testimonials_section = Section.objects.create(
            page=homepage,
            identifier="jcw-tire-center-premium-01-testimonials-01",
            order=3
        )
        
        # Testimonials fields
        Field.objects.create(section=testimonials_section, key="title", value="What Our Customers Say")
        Field.objects.create(section=testimonials_section, key="subtitle", value="Don't just take our word for it - hear from our satisfied customers")
        
        Field.objects.create(section=testimonials_section, key="testimonial_1_name", value="Mike Rodriguez")
        Field.objects.create(section=testimonials_section, key="testimonial_1_review", value="Outstanding service! Joe's team replaced all four tires on my truck in under an hour. The quality is top-notch and the prices are very reasonable. Highly recommend!")
        Field.objects.create(section=testimonials_section, key="testimonial_1_rating", value="5")
        
        Field.objects.create(section=testimonials_section, key="testimonial_2_name", value="Sarah Chen")
        Field.objects.create(section=testimonials_section, key="testimonial_2_review", value="Best tire shop in town! They helped me choose the perfect tires for my daily commute and the difference in ride quality is amazing. Professional and friendly service.")
        Field.objects.create(section=testimonials_section, key="testimonial_2_rating", value="5")
        
        Field.objects.create(section=testimonials_section, key="testimonial_3_name", value="David Johnson")
        Field.objects.create(section=testimonials_section, key="testimonial_3_review", value="Been coming here for years and they never disappoint. Fast, reliable service with honest recommendations. Joe really knows his stuff when it comes to tires.")
        Field.objects.create(section=testimonials_section, key="testimonial_3_rating", value="5")
        
        print("✓ Created premium testimonials section")
        
        # Create Premium Contact Section
        contact_section = Section.objects.create(
            page=homepage,
            identifier="jcw-tire-center-premium-01-contact-01",
            order=4
        )
        
        # Contact fields
        Field.objects.create(section=contact_section, key="title", value="Get in Touch")
        Field.objects.create(section=contact_section, key="subtitle", value="Ready to upgrade your tires? Contact us today for premium service")
        Field.objects.create(section=contact_section, key="address", value="456 Premium Drive, Tire City, TC 67890")
        Field.objects.create(section=contact_section, key="phone", value="(555) 123-TIRE")
        Field.objects.create(section=contact_section, key="email", value="service@joespremiumtires.com")
        Field.objects.create(section=contact_section, key="hours", value="Mon-Fri: 7AM-7PM, Sat: 8AM-5PM, Sun: 10AM-4PM")
        
        print("✓ Created premium contact section")
        
        print(f"\n✅ Successfully created {homepage.sections.count()} premium sections for Joe's Tire Center!")
        
    except SiteProject.DoesNotExist:
        print("Joe's Garage project not found!")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    create_premium_tire_sections()