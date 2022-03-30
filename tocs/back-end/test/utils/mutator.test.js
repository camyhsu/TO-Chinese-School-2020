/* global describe, it */
import { formatAddressPhoneNumbers } from "../../src/utils/mutator.js";

describe("mutator", () => {
  describe("formatAddressPhoneNumbers", () => {
    it("formatAddressPhoneNumbers", async () => {
      const obj = {
        homePhone: "1111111111",
        cellPhone: "2222222222",
        address: {
          homePhone: "3333333333",
          cellPhone: "4444444444",
        },
        families: [
          {
            homePhone: "5555555555",
            cellPhone: "6666666666",
          },
          {
            homePhone: "7777777777",
            cellPhone: "8888888888",
          },
        ],
      };

      formatAddressPhoneNumbers(obj);

      expect(obj.homePhone).toBe("(111) 111-1111");
      expect(obj.cellPhone).toBe("(222) 222-2222");
      expect(obj.address.homePhone).toBe("(333) 333-3333");
      expect(obj.address.cellPhone).toBe("(444) 444-4444");
      expect(obj.families[0].homePhone).toBe("(555) 555-5555");
      expect(obj.families[0].cellPhone).toBe("(666) 666-6666");
      expect(obj.families[1].homePhone).toBe("(777) 777-7777");
      expect(obj.families[1].cellPhone).toBe("(888) 888-8888");
    });
  });
});
