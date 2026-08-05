const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'analyst@patentmap.org';
  const rawPassword = 'Password123!';
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  // Upsert Test User
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      isOtpVerified: true
    },
    create: {
      email,
      name: 'Patent Analyst',
      password: hashedPassword,
      isOtpVerified: true
    }
  });

  console.log('✅ Test User Seeded Successfully:');
  console.log(`   Email: ${user.email}`);
  console.log(`   Password: ${rawPassword}`);
  console.log(`   OTP Verified: ${user.isOtpVerified}`);

  // Seed sample patent
  const patentCount = await prisma.patent.count({ where: { userId: user.id } });
  if (patentCount === 0) {
    const pat = await prisma.patent.create({
      data: {
        userId: user.id,
        title: 'System and Method for Deep Learning Feature Classification in Multi-Modal Sensor Networks',
        abstract: 'Methods and systems for training multi-layer neural network classifiers using dynamic feature extraction from multi-modal sensor arrays.',
        claims: '1. A computer-implemented method comprising receiving sensor data streams, generating feature vectors using a convolutional neural network layer, and computing loss functions based on multi-task attention mechanisms.',
        description: 'The present invention relates generally to artificial intelligence and deep neural network architecture optimization.',
        sourceType: 'TEXT',
        status: 'PROCESSED'
      }
    });

    await prisma.domainAnalysis.create({
      data: {
        patentId: pat.id,
        dominantDomain: 'Artificial Intelligence & Machine Learning',
        dominantPct: 78.5,
        dependentDomainsJson: JSON.stringify([
          { name: 'Cryptography & Cybersecurity', percentage: 16.2 },
          { name: 'Wireless Communication', percentage: 5.3 }
        ])
      }
    });

    await prisma.cPCRecommendation.create({
      data: {
        patentId: pat.id,
        cpcCode: 'G06F 18/20',
        description: 'Pattern recognition, machine learning classifiers, statistical feature extraction',
        section: 'G',
        subclass: 'G06F',
        confidence: 94.2
      }
    });

    await prisma.report.create({
      data: {
        userId: user.id,
        patentId: pat.id,
        title: 'Patent Dossier - Deep Learning Feature Classification',
        reportFormat: 'PDF',
        reportDataJson: JSON.stringify({ reportId: 'REP-89412', generatedAt: new Date().toISOString() })
      }
    });

    await prisma.savedPatent.create({
      data: {
        userId: user.id,
        patentId: pat.id,
        notes: 'Primary benchmark patent for neural network classification'
      }
    });

    console.log('✅ Initial Sample Patent & Analysis Data Seeded.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
