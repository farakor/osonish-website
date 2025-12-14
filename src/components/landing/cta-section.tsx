import { Button } from "@/components/ui/button";
import { Container } from "../shared/container";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl border border-gray-200 p-8 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Готовы начать?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Присоединяйтесь к тысячам пользователей, которые уже нашли работу
              или наняли профессионалов через Osonish
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-primary text-white hover:bg-primary/90 text-base px-8 h-12"
                asChild
              >
                <a href="/orders/create">
                  Создать заказ
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 text-gray-900 hover:bg-gray-50 text-base px-8 h-12"
                asChild
              >
                <a href="/auth/register">Зарегистрироваться</a>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

