'use client'

import style from './page.module.css';

export default function Menu() {
  return (
    <div>

    
      <div className={style.menu}>
        <a href="#home">HOME</a>
        <a href="#barbearia">BARBEARIA</a>
        <a href="#servicos">SERVIÇOS</a>
        <a href="#localizacao">LOCALIZAÇÃO</a>
        <a href="#agendar">AGENDAR</a>
        <a href="userNew">CADASTRAR</a>
        <a href="novoLogin">ENTRAR</a>
      </div>

      <section id="home" className={style.section}>
        <div className={style.container}>

          <div className={style.imgWrapper}>
            <img src="/logo3.png" alt="Barbearia do Deda" className={style.img} />
          </div>

          <div className={style.textos}>
            <h1 className={style.h1}>Barbearia do Deda</h1>
            <h2 className={style.h2}>Seja bem-vindo!</h2>

            <p className={style.p1}>
              Renove seu visual. Redescubra sua confiança.
            </p>

            <p className={style.p2}>
              Dos cortes clássicos aos estilos modernos, aqui é o lugar certo
              para quem valoriza estilo, cuidado e personalidade.
            </p>

            <p className={style.p3}>
              Agende seu horário agora e viva a experiência Deda.
            </p>
          </div>

        </div>
      </section>

      <section id="barbearia" className={style.section}>
        <h1 className={style.h11}>Sobre a barbearia</h1>

        <div className={style.conteudo}>
          <p className={style.sobre}>
            A Barbearia do Deda nasceu com muito esforço, persistência e vontade de fazer a diferença. O início foi difícil, marcado por desafios e críticas, mas com trabalho bem feito e comprometimento, o espaço foi se fortalecendo e conquistando seu lugar na comunidade. <br /><br /> Localizada no centro da cidade de Areia, a barbearia possui um estilo raiz e aconchegante, pensado para que os clientes se sintam à vontade. Aqui, o ambiente vai além do corte de cabelo: existe conversa, brincadeira, respeito e amizade. <br /><br /> O grande diferencial da Barbearia do Deda está no atendimento de qualidade, no trabalho bem executado e também na flexibilidade de horários.
          </p>

          <div className={style.box2}>
            <h3>Sobre o barbeiro</h3>

            <p className={style.cardInfo}>
             Minha trajetória como barbeiro começou com muitos desafios e sem acesso a cursos, mas com grande vontade de aprender. Ainda jovem, encontrei na barbearia uma oportunidade de transformar minha vida e segui firme, mesmo diante das dificuldades e críticas. Prezo pelo profissionalismo e por um atendimento cuidadoso nos detalhes, desde a forma de colocar a capa até o manuseio da tesoura e da máquina. Meu objetivo é sempre oferecer um serviço de qualidade, em um ambiente leve, respeitoso e acolhedor.
            </p>

            <div className={style.circle}>
              <img src="/barbeiro.png" className={style.circleImg} />
            </div>
          </div>
        </div>
      </section>


      <section id="servicos" className={style.section}>
        <h1 className={style.servicos}>Serviços</h1>

        <div className={style.servicosContainer}>
          <img src="corte.png" />
          <img src="barba.png" />
          <img src="cortebarba.png" />
        </div>
      </section>

    
      <section id="agendar" className={style.section}>
        <h1 className={style.agendar}>Agende Seu Horário</h1>

        <p className={style.text}>
          Reserve seu horário de forma rápida e prática
          para aproveitar a qualidade e o atendimento especializado da nossa barbearia. Oferecemos uma experiência única, com cortes de cabelo e barba em um ambiente confortável e acolhedor.
        </p>

        <a href="novoLogin" className={style.irparalog}>Agendar</a>

        <div className={style.retangulo2}></div>
      </section>

      <section id="localizacao" className={style.localizacao}>
        <h1 className={style.local}>Onde estamos?</h1>

        <p className={style.text2}>
          Praça Dr. Cunha Lima, Areia - PB.
        </p>

        <iframe
          className={style.mapa}
          width="450"
          height="300"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.3518266415176!2d-35.705077523684125!3d-6.967756268227034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ac33b25cc61d17%3A0xf59a5436dc1b8036!2sBarbearia%20do%20Deda!5e0!3m2!1spt-BR!2sbr!4v1756246641833!5m2!1spt-BR!2sbr"
        />

      </section>

       <footer className={style.footer}>
  <p className={style.footerTitle}>
    Dúvidas? Entre em contato ou nos acompanhe nas redes sociais
  </p>

  <div className={style.footerContacts}>
    <div className={style.contactItem}>
      <img src="whats.png" alt="WhatsApp" />
      <span>(83) 99845-4640</span>
    </div>

    <div className={style.contactItem}>
      <img src="insta.png" alt="Instagram" />
      <span>@deda.barbeiro</span>
    </div>
  </div>

  <span className={style.footerCopy}>
    © {new Date().getFullYear()} Barbearia do Deda — Todos os direitos reservados
  </span>
</footer>


    </div>
  );
}
