"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const About = () => {
  const milestones = [
    {
      year: "2024",
      title: "Khởi tạo NextGenAI",
      description:
        "Ý tưởng về một nền tảng kết nối AI và Source Code được hình thành",
      icon: "🚀",
    },
    {
      year: "2024",
      title: "Phát triển Backend",
      description:
        "Xây dựng hệ thống backend với Node.js, MongoDB và AI integration",
      icon: "⚙️",
    },
    {
      year: "2024",
      title: "Launch Frontend",
      description:
        "Ra mắt giao diện người dùng với công nghệ 3D và Space Theme",
      icon: "🎨",
    },
    {
      year: "2024",
      title: "Cộng đồng 1000+",
      description: "Đạt mốc 1000 developer tham gia cộng đồng",
      icon: "👥",
    },
    {
      year: "2024",
      title: "AI Planner v2.0",
      description:
        "Nâng cấp AI Planner với khả năng phân tích dự án thông minh",
      icon: "🤖",
    },
  ];

  const team = [
    {
      name: "Nguyễn Văn A",
      role: "Founder & CEO",
      avatar: "👨‍💻",
      description: "Full-stack developer với 5+ năm kinh nghiệm",
    },
    {
      name: "Trần Thị B",
      role: "CTO",
      avatar: "👩‍💻",
      description: "AI/ML Engineer chuyên về Natural Language Processing",
    },
    {
      name: "Lê Văn C",
      role: "Lead Designer",
      avatar: "🎨",
      description: "UI/UX Designer với đam mê về 3D và Space Design",
    },
    {
      name: "Phạm Thị D",
      role: "Product Manager",
      avatar: "📊",
      description: "Product Manager với kinh nghiệm trong EdTech",
    },
  ];

  const values = [
    {
      icon: "🚀",
      title: "Innovation",
      description: "Luôn tiên phong trong việc áp dụng công nghệ mới",
    },
    {
      icon: "🤝",
      title: "Community",
      description: "Xây dựng cộng đồng developer mạnh mẽ và hỗ trợ lẫn nhau",
    },
    {
      icon: "🎯",
      title: "Quality",
      description: "Cam kết mang đến những sản phẩm chất lượng cao",
    },
    {
      icon: "🌍",
      title: "Accessibility",
      description: "Làm cho công nghệ trở nên dễ tiếp cận với mọi người",
    },
  ];

  return (
    <div className="min-h-screen tech-universe-bg pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold font-display mb-6">
            🌍 About NextGenAI
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Hành trình xây dựng vũ trụ code và AI của chúng tôi
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="tech-card p-12 mb-16"
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold font-display  mb-6">
              🎯 Sứ mệnh của chúng tôi
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
              NextGenAI được sinh ra với sứ mệnh kết nối thế giới code và trí
              tuệ nhân tạo, tạo ra một nền tảng nơi các developer có thể khám
              phá, học hỏi và phát triển cùng với sự hỗ trợ của AI. Chúng tôi
              tin rằng tương lai của phát triển phần mềm nằm ở sự kết hợp hài
              hòa giữa sự sáng tạo của con người và sức mạnh của AI.
            </p>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold font-display  mb-12 text-center">
            🛰️ Hành trình phát triển
          </h2>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-neon-blue via-neon-purple to-neon-green"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`flex items-center ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  <div
                    className={`w-1/2 ${
                      index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"
                    }`}
                  >
                    <div className="tech-card p-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">{milestone.icon}</span>
                        <span className="text-neon-blue font-bold">
                          {milestone.year}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-400">{milestone.description}</p>
                    </div>
                  </div>

                  <div className="w-4 h-4 bg-neon-blue rounded-full border-4 border-dark-900 z-10"></div>
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold font-display  mb-12 text-center">
            💎 Giá trị cốt lõi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="tech-card text-center p-6"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold font-display  mb-12 text-center">
            👥 Đội ngũ phát triển
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="tech-card text-center p-6"
              >
                <div className="text-6xl mb-4">{member.avatar}</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-neon-blue font-semibold mb-3">
                  {member.role}
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="tech-card p-12 mb-16"
        >
          <h2 className="text-4xl font-bold font-display  mb-12 text-center">
            📊 Thành tựu
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "10K+", label: "Dự án có sẵn", icon: "💻" },
              { number: "5K+", label: "Developer", icon: "👥" },
              { number: "50K+", label: "Lượt tải", icon: "📥" },
              { number: "99%", label: "Hài lòng", icon: "⭐" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-4xl font-bold  mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="tech-card p-12">
            <h2 className="text-4xl font-bold font-display  mb-6">
              🚀 Tham gia cùng chúng tôi
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Hãy trở thành một phần của cộng đồng developer hàng đầu và khám
              phá thế giới code đầy sáng tạo cùng NextGenAI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="px-8 py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-xl font-semibold text-lg hover:shadow-neon transition-all duration-300 transform hover:scale-105"
              >
                🎯 Đăng ký miễn phí
              </Link>
              <Link
                href="/explore"
                className="px-8 py-4 glass text-white rounded-xl font-semibold text-lg hover:shadow-neon transition-all duration-300 transform hover:scale-105"
              >
                🛒 Khám phá ngay
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
