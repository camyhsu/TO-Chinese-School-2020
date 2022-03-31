/* eslint-disable max-len */
import CreditCard from "../../src/utils/credit-card";
import { process } from "../../src/utils/payment-gateway";

describe("Credit Card", () => {
  describe("creditCardCreator", () => {
    it("creditCardCreator", async () => {
      expect(
        new CreditCard("4532928211171666", "1221", "123").validate().isValid
      ).toBe(true);
      expect(
        new CreditCard("4532928211171666", "1221").validate().isValid
      ).toBe(false);
      expect(new CreditCard("4532928211171666", "1221").validate().error).toBe(
        "CVV"
      );

      expect(
        new CreditCard("4532928211171666", "1321").validate().isValid
      ).toBe(false);
      expect(new CreditCard("4532928211171666", "1321").validate().error).toBe(
        "Expiration Date"
      );

      expect(new CreditCard("453292821117166").validate().isValid).toBe(false);
      expect(new CreditCard("453292821117166").validate().error).toBe("Number");
    });

    it("card type", async () => {
      expect(
        new CreditCard("342826328808014", "1221", "123").validate().type
      ).toBe("american-express");
      expect(
        new CreditCard("3014481532938230", "1221", "123").validate().type
      ).toBe("diners-club");
      expect(
        new CreditCard("6011229168236619", "1221", "123").validate().type
      ).toBe("discover");
      expect(
        new CreditCard("5323052417528049", "1221", "123").validate().type
      ).toBe("mastercard");
      expect(
        new CreditCard("6222023945730720", "1221", "123").validate().type
      ).toBe("unionpay");
      expect(
        new CreditCard("4532928211171666", "1221", "123").validate().type
      ).toBe("visa");
    });
  });

  describe("authorize.net", () => {
    it("authorize.net", async () => {
      const amount = 430.0;
      const gatewayId = Date.now();
      const creditCard = {
        cardNumber: "4242424242424242",
        expirationDate: "0822",
        cardCode: "999",
      };

      const rtn = await process({
        invoiceNumber: gatewayId,
        amount,
        creditCard,
      });
      console.log("===========\n", rtn);
      expect(rtn.description).toBe("This transaction has been approved.");
    });
  });

  describe("last 4", () => {
    it("last 4", async () => {
      expect(
        new CreditCard("342826328808014", "1221", "123").validate().last4
      ).toBe("8014");
    });
  });
});
