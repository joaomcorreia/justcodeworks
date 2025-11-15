import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteProject, Page, Section, Field

# Get the garage project
project = SiteProject.objects.get(slug='oficina-paulo-calibra')
page = project.pages.first()

print(f"Adding missing sections to {project.name}")

# Add quote form section
quote_section = Section.objects.create(
    page=page,
    identifier="jcw-auto-garage-modern-01-form-quote-01",
    internal_name="Quote Form Section",
    order=5
)

quote_fields = [
    ("title", "Pedir Orçamento Gratuito"),
    ("subtitle", "Preencha o formulário e entraremos em contacto consigo"),
    ("form_name_label", "Nome completo"),
    ("form_email_label", "Email"),
    ("form_phone_label", "Telemóvel"),
    ("form_license_plate_label", "Matrícula"),
    ("form_vehicle_label", "Marca e modelo do veículo"),
    ("form_service_label", "Tipo de serviço pretendido"),
    ("form_message_label", "Descrição do problema ou serviço"),
    ("form_submit_text", "Enviar Pedido"),
    ("privacy_text", "Os seus dados serão tratados com confidencialidade.")
]

for i, (key, value) in enumerate(quote_fields):
    Field.objects.create(
        section=quote_section,
        key=key,
        value=value,
        order=i
    )

# Add contact section  
contact_section = Section.objects.create(
    page=page,
    identifier="jcw-auto-garage-modern-01-contact-01",
    internal_name="Contact Section",
    order=6
)

contact_fields = [
    ("title", "Contactos e Localização"),
    ("address_title", "Morada"),
    ("address", "Rua das Oficinas, 123\n1000-001 Lisboa"),
    ("phone_title", "Telefone"),
    ("phone", "+351 21 123 4567"),
    ("email_title", "Email"),
    ("email", "geral@oficinacalibra.pt"),
    ("hours_title", "Horário de Funcionamento"),
    ("hours_weekdays", "Segunda a Sexta: 8h00 - 18h00"),
    ("hours_saturday", "Sábado: 8h00 - 13h00"),
    ("hours_sunday", "Domingo: Encerrado"),
    ("map_title", "Como Chegar"),
    ("map_link", "https://maps.google.com"),
    ("directions", "Estacionamento gratuito disponível")
]

for i, (key, value) in enumerate(contact_fields):
    Field.objects.create(
        section=contact_section,
        key=key,
        value=value,
        order=i
    )

print(f"✅ Added quote form section with {len(quote_fields)} fields")
print(f"✅ Added contact section with {len(contact_fields)} fields")
print("🚀 All garage sections are now complete!")